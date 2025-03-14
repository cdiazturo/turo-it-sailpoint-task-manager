import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  FileText,
  Info,
  Loader2,
  RefreshCw,
  Server,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import type { TaskStatusBeta } from "sailpoint-api-client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const getStatusIcon = (status: string | null | undefined) => {
  if (!status) return <Loader2 className="h-4 w-4 animate-spin" />;

  switch (status.toLowerCase()) {
    case "success": {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    case "pending":
    case "in progress": {
      return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />;
    }
    case "error":
    case "failed": {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    case "cancelled":
    case "terminated": {
      return <X className="h-4 w-4 text-gray-500" />;
    }
    case "warning": {
      return <Info className="h-4 w-4 text-orange-500" />;
    }
    default: {
      return <Info className="h-4 w-4 text-blue-500" />;
    }
  }
};

const formatDate = (dateValue: Date | string | null | undefined) => {
  if (!dateValue) return "N/A";
  try {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Invalid date";
  }
};

// Calculate task duration between launched and completed times
const calculateDuration = (
  launched: string | null | undefined,
  completed: string | null | undefined,
) => {
  if (!launched || !completed) return "N/A";
  try {
    const start = new Date(launched);
    const end = new Date(completed);
    const durationMs = end.getTime() - start.getTime();

    // Format duration in a readable way
    const seconds = Math.floor(durationMs / 1000);
    if (seconds < 60) return `${seconds.toString()} seconds`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)
      return `${minutes.toString()} min ${(seconds % 60).toString()} sec`;
    const hours = Math.floor(minutes / 60);
    return `${hours.toString()} hr ${(minutes % 60).toString()} min`;
  } catch {
    return "Invalid duration";
  }
};

// Summarize task results from the attributes
const summarizeTaskResults = (task: TaskStatusBeta) => {
  if (!task.attributes) return [];

  const results: Array<{ label: string; value: string }> = [];

  // Common metrics to extract
  const metrics = [
    { key: "total", label: "Total" },
    { key: "created", label: "Created" },
    { key: "updated", label: "Updated" },
    { key: "deleted", label: "Deleted" },
    { key: "optimized", label: "Unchanged" },
  ];

  for (const metric of metrics) {
    if (task.attributes[metric.key]) {
      results.push({
        label: metric.label,
        value: String(task.attributes[metric.key]),
      });
    }
  }

  return results.length > 0 ? results : undefined;
};

interface TaskListProperties {
  currentPage?: number;
  description?: string;
  loading: boolean;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
  onViewDetails?: (taskId: string) => void;
  pageSize?: number;
  refreshing: boolean;
  tasks: TaskStatusBeta[];
  title: string;
  totalCount?: number;
}

export function TaskList({
  currentPage = 1,
  description,
  loading,
  onPageChange,
  onRefresh,
  onViewDetails,
  pageSize = 10,
  refreshing,
  tasks,
  totalCount = 0,
}: TaskListProperties) {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {},
  );

  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTasks((previous) => ({
      ...previous,
      [taskId]: !previous[taskId],
    }));
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Helper function to render content based on loading state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No tasks found
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tasks.map((task) => {
          const taskResults = summarizeTaskResults(task);
          const duration = calculateDuration(task.launched, task.completed);
          return (
            <Card
              key={task.id}
              className={cn(
                "transition-all hover:shadow",
                task.completionStatus?.toLowerCase() === "success" &&
                  "border-green-200",
                task.completionStatus?.toLowerCase() === "failed" &&
                  "border-red-200",
                !task.completionStatus && "border-yellow-200",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        {task.type}
                      </Badge>
                      {getStatusIcon(task.completionStatus)}
                      <span className="text-sm font-medium">
                        {task.completionStatus || "In Progress"}
                      </span>
                      {task.percentComplete != undefined && (
                        <span className="text-xs text-muted-foreground">
                          ({task.percentComplete}%)
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-medium mt-1 line-clamp-1">
                      {task.description || task.uniqueName || task.id}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {onViewDetails && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/tasks/${task.id}`}>View Details</Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskExpanded(task.id)}
                    >
                      {expandedTasks[task.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress indicator */}
                  {task.percentComplete != undefined && (
                    <div className="space-y-1">
                      <Progress value={task.percentComplete} />
                    </div>
                  )}

                  {/* Task key information - always visible */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <TooltipProvider>
                      {/* Target Information */}
                      <div className="flex items-center space-x-1.5">
                        <Database className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate">
                              {task.target?.name ? (
                                <span>{task.target.name}</span>
                              ) : (
                                <span className="text-muted-foreground">
                                  No target
                                </span>
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {task.target?.type} - {task.target?.name || "N/A"}
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Created Time */}
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{formatDate(task.created)}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Created:{" "}
                            {new Date(task.created || "").toLocaleString()}
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center space-x-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{duration}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {task.launched && (
                              <div>
                                Started:{" "}
                                {new Date(task.launched).toLocaleString()}
                              </div>
                            )}
                            {task.completed && (
                              <div>
                                Completed:{" "}
                                {new Date(task.completed).toLocaleString()}
                              </div>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Initiator */}
                      <div className="flex items-center space-x-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span>{task.launcher || "System"}</span>
                      </div>
                    </TooltipProvider>
                  </div>

                  {/* Task metrics - shown if available */}
                  {taskResults && taskResults.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 border-t">
                      {taskResults.map((result, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xs text-muted-foreground">
                            {result.label}
                          </div>
                          <div className="text-sm font-medium">
                            {result.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Expanded details */}
                  {expandedTasks[task.id] && (
                    <div className="mt-4 pt-3 border-t text-sm space-y-3">
                      {/* Task Definition */}
                      {task.taskDefinitionSummary && (
                        <div className="space-y-1">
                          <div className="font-medium flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                            Task Definition
                          </div>
                          <div className="pl-5 text-sm">
                            <div>
                              Name: {task.taskDefinitionSummary.uniqueName}
                            </div>
                            {task.taskDefinitionSummary.description && (
                              <div>
                                Description:{" "}
                                {task.taskDefinitionSummary.description}
                              </div>
                            )}
                            {task.taskDefinitionSummary.executor && (
                              <div>
                                Executor: {task.taskDefinitionSummary.executor}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Task Return Values */}
                      {task.returns && task.returns.length > 0 && (
                        <div className="space-y-1">
                          <div className="font-medium flex items-center">
                            <Server className="h-4 w-4 mr-1 text-muted-foreground" />
                            Return Values
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 pl-5">
                            {task.returns
                              .slice(0, 8)
                              .map((returnValue, index) => (
                                <div key={index} className="text-sm">
                                  <span className="text-muted-foreground">
                                    {returnValue.attributeName}:{" "}
                                  </span>
                                  <span>
                                    {task.attributes?.[
                                      returnValue.attributeName
                                    ] || "N/A"}
                                  </span>
                                </div>
                              ))}
                            {task.returns.length > 8 && (
                              <div className="text-sm text-muted-foreground">
                                And {task.returns.length - 8} more...
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Messages */}
                      {task.messages && task.messages.length > 0 && (
                        <div className="space-y-1">
                          <div className="font-medium">Messages:</div>
                          <ul className="list-disc list-inside pl-2 space-y-1">
                            {task.messages.map((message, index) => (
                              <li key={index}>
                                {String(message.localizedText?.message)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Pagination */}
        {totalPages > 1 && onPageChange && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && onPageChange(currentPage - 1)
                  }
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* First page */}
              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationLink>...</PaginationLink>
                </PaginationItem>
              )}

              {/* Previous page */}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(currentPage - 1)}>
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page */}
              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>

              {/* Next page */}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(currentPage + 1)}>
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis */}
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationLink>...</PaginationLink>
                </PaginationItem>
              )}

              {/* Last page */}
              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && onPageChange(currentPage + 1)
                  }
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    );
  };

  return (
    <div>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      {onRefresh && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      )}
      {renderContent()}
    </div>
  );
}

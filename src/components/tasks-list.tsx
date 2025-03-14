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
  Server,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import type { TaskStatusBeta } from "sailpoint-api-client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { cn, getContainerRadius } from "@/lib/utils";

const getStatusIcon = (status: string | null | undefined) => {
  if (!status) return <Loader2 className="h-4 w-4 animate-spin" />;

  switch (status.toLowerCase()) {
    case "success": {
      return <CheckCircle2 className="text-interactive-success h-4 w-4" />;
    }
    case "pending":
    case "in progress": {
      return <Loader2 className="text-interactive-02 h-4 w-4 animate-spin" />;
    }
    case "error":
    case "failed": {
      return <XCircle className="text-interactive-destructive h-4 w-4" />;
    }
    case "cancelled":
    case "terminated": {
      return <X className="text-text-02 h-4 w-4" />;
    }
    case "warning": {
      return <Info className="text-interactive-02 h-4 w-4" />;
    }
    default: {
      return <Info className="text-primary h-4 w-4" />;
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

// Adjust percentComplete based on completion status
const adjustPercentComplete = (
  percentComplete: number | undefined,
  completionStatus: string | null | undefined,
) => {
  // If percentComplete is 0 and status is not "In Progress", set to 100
  if (
    percentComplete === 0 &&
    completionStatus &&
    completionStatus.toLowerCase() !== "in progress"
  ) {
    return 100;
  }

  return percentComplete;
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
  onViewDetails?: (taskId: string) => void;
  pageSize?: number;
  tasks: TaskStatusBeta[];
  title: string;
  totalCount?: number;
}

export function TaskList({
  currentPage = 1,
  description,
  loading,
  onPageChange,
  onViewDetails,
  pageSize = 10,
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
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="text-muted-foreground py-8 text-center">
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
                `hover:elevation-1 transition-all ${getContainerRadius("sm")}`,
                task.completionStatus?.toLowerCase() === "success" &&
                  "border-surface-success",
                task.completionStatus?.toLowerCase() === "failed" &&
                  "border-surface-error",
                !task.completionStatus && "border-surface-02",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
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
                        <span className="text-muted-foreground text-xs">
                          (
                          {adjustPercentComplete(
                            task.percentComplete,
                            task.completionStatus,
                          )}
                          %)
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 line-clamp-1 text-base font-medium">
                      {task.description || task.uniqueName || task.id}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {onViewDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className={getContainerRadius("xs")}
                      >
                        <Link to={`/tasks/${task.id}`}>View Details</Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskExpanded(task.id)}
                      className={getContainerRadius("xs")}
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
                      <Progress
                        value={adjustPercentComplete(
                          task.percentComplete,
                          task.completionStatus,
                        )}
                      />
                    </div>
                  )}

                  {/* Error Alert */}
                  {(task.completionStatus?.toLowerCase() === "error" ||
                    task.completionStatus?.toLowerCase() === "failed") &&
                    task.messages &&
                    task.messages.length > 0 && (
                      <Alert
                        variant="destructive"
                        className={getContainerRadius("sm")}
                      >
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          {task.messages.map((message, index) => (
                            <p key={index}>
                              {String(message.localizedText?.message)}
                            </p>
                          ))}
                        </AlertDescription>
                      </Alert>
                    )}

                  {/* Task key information - always visible */}
                  <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                    <TooltipProvider>
                      {/* Target Information */}
                      <div className="flex items-center space-x-1.5">
                        <Database className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />
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
                          <TooltipContent className={getContainerRadius("xs")}>
                            {task.target?.type} - {task.target?.name || "N/A"}
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Created Time */}
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{formatDate(task.created)}</span>
                          </TooltipTrigger>
                          <TooltipContent className={getContainerRadius("xs")}>
                            Created:{" "}
                            {new Date(task.created || "").toLocaleString()}
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center space-x-1.5">
                        <Clock className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{duration}</span>
                          </TooltipTrigger>
                          <TooltipContent className={getContainerRadius("xs")}>
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
                        <User className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />
                        <span>{task.launcher || "System"}</span>
                      </div>
                    </TooltipProvider>
                  </div>

                  {/* Task metrics - shown if available */}
                  {taskResults && taskResults.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 border-t pt-2 md:grid-cols-5">
                      {taskResults.map((result, index) => (
                        <div key={index} className="text-center">
                          <div className="text-muted-foreground text-xs">
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
                    <div className="mt-4 space-y-3 border-t pt-3 text-sm">
                      {/* Task Definition */}
                      {task.taskDefinitionSummary && (
                        <div className="space-y-1">
                          <div className="flex items-center font-medium">
                            <FileText className="text-muted-foreground mr-1 h-4 w-4" />
                            Task Definition
                          </div>
                          <div className="pl-5 text-sm">
                            <span className="text-muted-foreground">Name:</span>{" "}
                            {task.taskDefinitionSummary.uniqueName}
                            {task.taskDefinitionSummary.description && (
                              <div>
                                <span className="text-muted-foreground">
                                  Description:
                                </span>{" "}
                                {task.taskDefinitionSummary.description}
                              </div>
                            )}
                            {task.taskDefinitionSummary.executor && (
                              <div>
                                <span className="text-muted-foreground">
                                  Executor:
                                </span>{" "}
                                {task.taskDefinitionSummary.executor}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Task Return Values */}
                      {task.returns && task.returns.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center font-medium">
                            <Server className="text-muted-foreground mr-1 h-4 w-4" />
                            Return Values
                          </div>
                          <div className="grid grid-cols-1 gap-1 pl-5 md:grid-cols-2">
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
                              <div className="text-muted-foreground text-sm">
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
                          <ul className="list-inside list-disc space-y-1 pl-2">
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
      {renderContent()}
    </div>
  );
}

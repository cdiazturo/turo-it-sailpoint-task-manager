import { RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { data, useNavigation, useSubmit } from "react-router";
import {
  TaskManagementBetaApi,
  type TaskStatusBeta,
} from "sailpoint-api-client";

import { TaskList } from "@/components/tasks-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSailpointConfig } from "@/lib/sailpoint";
import { getContainerRadius } from "@/lib/utils";

import type { Route } from "./+types/tasks";

export function meta(_arguments: Route.MetaArgs) {
  return [
    { title: "SailPoint Tasks" },
    {
      name: "description",
      content: "Retrieve and manage SailPoint tasks",
    },
  ];
}

export async function loader({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
}: Route.LoaderArgs): Promise<{ data: TaskStatusBeta[] }> {
  try {
    const config = getSailpointConfig();
    const api = new TaskManagementBetaApi(config);
    const tasks = await api.getTaskStatusList({
      limit: 10,
      sorters: "-created",
    });
    return tasks;
  } catch (error) {
    console.error("Failed to load tenant information:", error);
    throw data("Failed to load tenant information", { status: 500 });
  }
}

export default function Tasks({ loaderData }: Route.ComponentProps) {
  const tasks = loaderData.data;
  const navigation = useNavigation();
  const submit = useSubmit();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  // Extract unique status and type values for filters
  const statuses = [
    ...new Set(
      tasks.map((task) => task.completionStatus).filter(Boolean) as string[],
    ),
  ];

  // Filter tasks based on search query and filters
  const filteredTasks = tasks.filter((task) => {
    // Filter by search query
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      task.description?.toLowerCase().includes(searchLower) ||
      task.uniqueName?.toLowerCase().includes(searchLower) ||
      task.id?.toLowerCase().includes(searchLower) ||
      task.target?.name?.toLowerCase().includes(searchLower);

    // Filter by status
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "In Progress"
        ? !task.completionStatus
        : task.completionStatus === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    // eslint-disable-next-line unicorn/no-null
    void submit(null, { method: "get", replace: true });
  };

  const isLoading = navigation.state === "loading";

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-foreground text-3xl">Tasks</h1>
        <Button
          variant="turo"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className={getContainerRadius("xs")}
        >
          <RefreshCw
            className={`text-text-02 mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <Card className={`elevation-1 ${getContainerRadius("sm")}`}>
        <CardHeader>
          <CardTitle className="text-foreground">Task Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Search className="text-text-02 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className={`flex-1 ${getContainerRadius("xs")}`}
              />
            </div>

            <Select
              value={statusFilter || ""}
              onValueChange={(value) =>
                setStatusFilter(value === "_all" ? undefined : value)
              }
            >
              <SelectTrigger className={getContainerRadius("xs")}>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent
                className={`elevation-2 ${getContainerRadius("sm")}`}
              >
                <SelectItem value="_all">All Statuses</SelectItem>
                <SelectItem value="In Progress">IN PROGRESS</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <TaskList tasks={filteredTasks} loading={isLoading} title={"Tasks"} />
    </div>
  );
}

import { useState } from "react";
import { useParams } from "react-router";

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
}

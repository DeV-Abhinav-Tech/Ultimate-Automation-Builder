export type NodeType = 'trigger' | 'action' | 'logic';

export type Category = 
  | 'webhook' 
  | 'schedule' 
  | 'email' 
  | 'http' 
  | 'ai' 
  | 'code' 
  | 'condition' 
  | 'delay' 
  | 'slack' 
  | 'database';

export interface WorkflowNode {
  id: string;
  name: string;
  type: NodeType;
  category: Category;
  description: string;
  iconName: string;
  config: Record<string, any>;
  nextStepIds?: string[]; // supports branching
  falseBranchStepId?: string; // for condition nodes
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  nodes: WorkflowNode[];
  triggerPayload: Record<string, any>;
}

export type ExecutionStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface StepLog {
  nodeId: string;
  nodeName: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  inputPayload: Record<string, any>;
  outputPayload: Record<string, any>;
  error?: string;
}

export interface ExecutionRun {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  totalDurationMs?: number;
  logs: StepLog[];
}

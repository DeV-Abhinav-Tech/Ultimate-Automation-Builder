import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { NodeConfigModal } from './components/NodeConfigModal';
import { ExecutionConsole } from './components/ExecutionConsole';
import { StepPickerModal } from './components/StepPickerModal';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { PayloadModal } from './components/PayloadModal';
import { PRESET_TEMPLATES } from './data/templates';
import type { Workflow, WorkflowNode, StepLog, ExecutionStatus } from './types/workflow';

export default function App() {
  const [workflow, setWorkflow] = useState<Workflow>(PRESET_TEMPLATES[0]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  
  // Execution engine states
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>('idle');
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [stepLogs, setStepLogs] = useState<StepLog[]>([]);
  const [totalDurationMs, setTotalDurationMs] = useState<number | undefined>(undefined);

  // Modal open toggles
  const [isStepPickerOpen, setIsStepPickerOpen] = useState(false);
  const [insertStepIndex, setInsertStepIndex] = useState<number | null>(null);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);

  // --- Step-by-Step Workflow Simulation Runner ---
  const handleRunWorkflow = async () => {
    setExecutionStatus('running');
    setStepLogs([]);
    setActiveStepId(null);
    const startTime = Date.now();
    const contextOutputs: Record<string, any> = {
      trigger: { ...workflow.triggerPayload }
    };

    const initialLogs: StepLog[] = workflow.nodes.map((n) => ({
      nodeId: n.id,
      nodeName: n.name,
      status: 'pending',
      inputPayload: {},
      outputPayload: {}
    }));
    setStepLogs(initialLogs);

    let currentSkipBranch = false;

    for (let i = 0; i < workflow.nodes.length; i++) {
      const node = workflow.nodes[i];

      // If previous condition branch evaluated to false and skipped next step
      if (currentSkipBranch) {
        currentSkipBranch = false;
        setStepLogs((prev) =>
          prev.map((l) =>
            l.nodeId === node.id ? { ...l, status: 'skipped' } : l
          )
        );
        continue;
      }

      // Mark step active
      setActiveStepId(node.id);
      setStepLogs((prev) =>
        prev.map((l) =>
          l.nodeId === node.id ? { ...l, status: 'running' } : l
        )
      );

      // Simulate step network / compute latency (600ms - 1000ms)
      const stepLatency = Math.floor(Math.random() * 400) + 600;
      await new Promise((resolve) => setTimeout(resolve, stepLatency));

      // Resolve step execution output payload
      let stepOutput: Record<string, any> = {};

      if (node.type === 'trigger') {
        stepOutput = {
          event: 'webhook_received',
          timestamp: new Date().toISOString(),
          payload: contextOutputs.trigger
        };
      } else if (node.category === 'ai') {
        stepOutput = {
          score: 'High',
          sentiment: 'Positive',
          confidence: 0.94,
          suggested_action: 'Direct to Senior Account Executive',
          summary: 'Prospect seeks enterprise tier with high budget readiness.'
        };
      } else if (node.category === 'condition') {
        const isTrue = true; // condition evaluation result
        stepOutput = {
          evaluated: true,
          field: node.config.field,
          condition_matched: isTrue
        };
        if (!isTrue) {
          currentSkipBranch = true;
        }
      } else if (node.category === 'slack') {
        stepOutput = {
          delivered: true,
          channel: node.config.channel || '#general',
          ts: '1721908492.000100'
        };
      } else if (node.category === 'email') {
        stepOutput = {
          delivered: true,
          recipient: contextOutputs.trigger.email || 'user@example.com',
          messageId: 'msg_98f31a29'
        };
      } else {
        stepOutput = {
          status: 200,
          statusText: 'OK',
          timestamp: new Date().toISOString(),
          processed: true
        };
      }

      contextOutputs[node.id] = stepOutput;

      setStepLogs((prev) =>
        prev.map((l) =>
          l.nodeId === node.id
            ? {
                ...l,
                status: 'success',
                durationMs: stepLatency,
                inputPayload: { config: node.config, triggerData: contextOutputs.trigger },
                outputPayload: stepOutput
              }
            : l
        )
      );
    }

    const duration = Date.now() - startTime;
    setTotalDurationMs(duration);
    setActiveStepId(null);
    setExecutionStatus('completed');

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 }
    });
  };

  // --- Node Editing & Reordering Handlers ---
  const handleUpdateNode = (updatedNode: WorkflowNode) => {
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n))
    }));
  };

  const handleDeleteNode = (nodeId: string) => {
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((n) => n.id !== nodeId)
    }));
  };

  const handleMoveNode = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= workflow.nodes.length) return;

    const newNodes = [...workflow.nodes];
    const temp = newNodes[index];
    newNodes[index] = newNodes[targetIdx];
    newNodes[targetIdx] = temp;

    setWorkflow((prev) => ({ ...prev, nodes: newNodes }));
  };

  const handleAddStepAt = (index: number) => {
    setInsertStepIndex(index);
    setIsStepPickerOpen(true);
  };

  const handleSelectNewStep = (stepTemplate: Partial<WorkflowNode>) => {
    const newNode: WorkflowNode = {
      id: `step-${Date.now()}`,
      name: stepTemplate.name || 'New Step',
      type: stepTemplate.type || 'action',
      category: stepTemplate.category || 'http',
      description: stepTemplate.description || 'Custom step operation',
      iconName: stepTemplate.iconName || 'Clock',
      config: stepTemplate.config || {}
    };

    const targetIdx = insertStepIndex !== null ? insertStepIndex : workflow.nodes.length;
    const newNodes = [...workflow.nodes];
    newNodes.splice(targetIdx, 0, newNode);

    setWorkflow((prev) => ({ ...prev, nodes: newNodes }));
    setInsertStepIndex(null);
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflow, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${workflow.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Header Navbar */}
      <Navbar
        workflow={workflow}
        onUpdateWorkflow={(upd) => setWorkflow((prev) => ({ ...prev, ...upd }))}
        onRunWorkflow={handleRunWorkflow}
        executionStatus={executionStatus}
        onOpenTemplates={() => setIsTemplateGalleryOpen(true)}
        onOpenStepPicker={() => handleAddStepAt(workflow.nodes.length)}
        onOpenPayloadModal={() => setIsPayloadModalOpen(true)}
        onExportJson={handleExportJson}
        onImportJson={() => setIsTemplateGalleryOpen(true)}
      />

      {/* Main Visual Step Flowchart Canvas */}
      <WorkflowCanvas
        nodes={workflow.nodes}
        activeStepId={activeStepId}
        stepLogs={stepLogs}
        executionStatus={executionStatus}
        onSelectNode={(node) => setSelectedNode(node)}
        onDeleteNode={handleDeleteNode}
        onMoveNode={handleMoveNode}
        onAddStepAt={handleAddStepAt}
      />

      {/* Real-time Execution Log Console */}
      <ExecutionConsole
        logs={stepLogs}
        status={executionStatus}
        totalDurationMs={totalDurationMs}
        onClearLogs={() => {
          setStepLogs([]);
          setExecutionStatus('idle');
        }}
      />

      {/* Step Config Modal */}
      <NodeConfigModal
        node={selectedNode}
        allNodes={workflow.nodes}
        onClose={() => setSelectedNode(null)}
        onSave={handleUpdateNode}
        onTestStep={(n) => {
          alert(`Testing single step: ${n.name}`);
        }}
      />

      {/* Step Picker Catalog Modal */}
      <StepPickerModal
        isOpen={isStepPickerOpen}
        onClose={() => setIsStepPickerOpen(false)}
        onSelectType={handleSelectNewStep}
      />

      {/* Templates Gallery Modal */}
      <TemplateGalleryModal
        isOpen={isTemplateGalleryOpen}
        onClose={() => setIsTemplateGalleryOpen(false)}
        onSelectTemplate={(tmpl) => setWorkflow(tmpl)}
      />

      {/* Trigger Payload Editor Modal */}
      <PayloadModal
        isOpen={isPayloadModalOpen}
        triggerPayload={workflow.triggerPayload}
        onClose={() => setIsPayloadModalOpen(false)}
        onSave={(newPayload) => setWorkflow((prev) => ({ ...prev, triggerPayload: newPayload }))}
      />
    </div>
  );
}

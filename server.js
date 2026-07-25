import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend build files if dist exists
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Node.js Express Automation Server', timestamp: new Date().toISOString() });
});

// Execute Workflow Step-by-Step Node.js Endpoint
app.post('/api/workflows/execute', async (req, res) => {
  const { workflow } = req.body;
  if (!workflow || !workflow.nodes) {
    return res.status(400).json({ error: 'Invalid workflow payload' });
  }

  const logs = [];
  const startTime = Date.now();

  try {
    const triggerData = workflow.triggerPayload || {};
    
    for (let i = 0; i < workflow.nodes.length; i++) {
      const node = workflow.nodes[i];
      const stepStart = Date.now();

      // Node.js Execution simulation per category
      let stepOutput = {};
      if (node.type === 'trigger') {
        stepOutput = {
          status: 'received',
          source: node.config.source || 'Node.js Webhook',
          payload: triggerData
        };
      } else if (node.category === 'ai') {
        stepOutput = {
          score: 'High',
          confidence: 0.96,
          model: node.config.model || 'gemini-3.5-flash',
          summary: 'Processed lead data via Node.js backend engine.'
        };
      } else if (node.category === 'condition') {
        stepOutput = {
          evaluated: true,
          matched: true,
          rule: `${node.config.field} ${node.config.operator} ${node.config.value}`
        };
      } else {
        stepOutput = {
          status: 200,
          statusText: 'OK',
          executed_by: 'Node.js Microservice',
          timestamp: new Date().toISOString()
        };
      }

      logs.push({
        nodeId: node.id,
        nodeName: node.name,
        status: 'success',
        durationMs: Date.now() - stepStart,
        inputPayload: node.config,
        outputPayload: stepOutput
      });
    }

    res.json({
      success: true,
      executionId: `exec_${Date.now()}`,
      totalDurationMs: Date.now() - startTime,
      logs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SPA Catch-all route to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`⚡ Ultimate Automation Builder Node.js Server running on port ${PORT}`);
});

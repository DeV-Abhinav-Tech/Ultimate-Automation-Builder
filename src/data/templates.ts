import type { Workflow } from '../types/workflow';

export const PRESET_TEMPLATES: Workflow[] = [
  {
    id: 'ai-lead-qualification',
    name: 'AI Lead Qualification & CRM Sync',
    description: 'Automatically analyze incoming website leads using AI, score intent, and dispatch alerts to Slack and CRM.',
    category: 'Sales & AI',
    active: true,
    createdAt: '2026-07-25T10:00:00Z',
    updatedAt: '2026-07-25T12:00:00Z',
    triggerPayload: {
      lead_name: 'Alex Mercer',
      email: 'alex@enterprise-cloud.io',
      company_size: '250-500',
      budget: '$50,000+',
      message: 'Looking for a dedicated workflow automation platform with SLA support.'
    },
    nodes: [
      {
        id: 'step-1',
        name: 'Webhook: Lead Form Submitted',
        type: 'trigger',
        category: 'webhook',
        description: 'Triggers when a new lead submits contact form on landing page',
        iconName: 'Webhook',
        config: {
          path: '/api/v1/webhooks/lead-capture',
          method: 'POST'
        },
        nextStepIds: ['step-2']
      },
      {
        id: 'step-2',
        name: 'AI Agent: Score Lead Intent',
        type: 'action',
        category: 'ai',
        description: 'Analyze company size, budget, and message using Gemini 3.5 AI',
        iconName: 'Sparkles',
        config: {
          prompt: 'Analyze lead {{trigger.lead_name}} from {{trigger.email}}. Score intent (High/Medium/Low) and write summary.',
          model: 'gemini-3.5-flash',
          temperature: 0.2
        },
        nextStepIds: ['step-3']
      },
      {
        id: 'step-3',
        name: 'Condition: High Priority Lead?',
        type: 'logic',
        category: 'condition',
        description: 'Check if AI lead score is High or budget > $25,000',
        iconName: 'GitFork',
        config: {
          field: '{{step-2.score}}',
          operator: 'equals',
          value: 'High'
        },
        nextStepIds: ['step-4'],
        falseBranchStepId: 'step-5'
      },
      {
        id: 'step-4',
        name: 'Slack: Urgent Sales VIP Notification',
        type: 'action',
        category: 'slack',
        description: 'Send immediate alert to #vip-leads Slack channel',
        iconName: 'MessageSquare',
        config: {
          channel: '#vip-leads',
          message: '🔥 HOT LEAD DETECTED! {{trigger.lead_name}} ({{trigger.email}}). AI Intent: {{step-2.score}}.'
        },
        nextStepIds: ['step-6']
      },
      {
        id: 'step-5',
        name: 'Email: Send Nurture Sequence',
        type: 'action',
        category: 'email',
        description: 'Add lead to email drip sequence for standard leads',
        iconName: 'Mail',
        config: {
          to: '{{trigger.email}}',
          subject: 'Welcome to our platform resources',
          templateId: 'standard-nurture-v1'
        },
        nextStepIds: ['step-6']
      },
      {
        id: 'step-6',
        name: 'Database: Upsert CRM Record',
        type: 'action',
        category: 'database',
        description: 'Save lead state and logs into internal postgres CRM database',
        iconName: 'Database',
        config: {
          table: 'crm_contacts',
          operation: 'UPSERT',
          primaryKey: 'email'
        }
      }
    ]
  },
  {
    id: 'ecommerce-order-fulfillment',
    name: 'E-Commerce Order Fulfillment & Fraud Check',
    description: 'Process incoming orders, run fraud verification, generate shipping labels, and notify customer.',
    category: 'E-Commerce',
    active: true,
    createdAt: '2026-07-20T08:00:00Z',
    updatedAt: '2026-07-24T14:30:00Z',
    triggerPayload: {
      order_id: 'ORD-98421',
      customer_email: 'buyer@example.com',
      total_amount: 349.99,
      currency: 'USD',
      ip_country: 'US',
      items_count: 3
    },
    nodes: [
      {
        id: 'step-1',
        name: 'Event: Order Placed',
        type: 'trigger',
        category: 'webhook',
        description: 'Triggers when a customer completes checkout on Shopify/Stripe',
        iconName: 'ShoppingBag',
        config: {
          source: 'Stripe Webhook',
          event: 'charge.succeeded'
        },
        nextStepIds: ['step-2']
      },
      {
        id: 'step-2',
        name: 'HTTP: Run Fraud Shield Verification',
        type: 'action',
        category: 'http',
        description: 'Send order metadata to Sift Science / FraudShield API',
        iconName: 'ShieldCheck',
        config: {
          url: 'https://api.fraudshield.io/v2/evaluate',
          method: 'POST',
          headers: { 'Authorization': 'Bearer sec_live_992x' }
        },
        nextStepIds: ['step-3']
      },
      {
        id: 'step-3',
        name: 'Condition: Risk Score Safe?',
        type: 'logic',
        category: 'condition',
        description: 'Check if fraud risk score < 30',
        iconName: 'GitFork',
        config: {
          field: '{{step-2.risk_score}}',
          operator: 'less_than',
          value: '30'
        },
        nextStepIds: ['step-4'],
        falseBranchStepId: 'step-5'
      },
      {
        id: 'step-4',
        name: 'HTTP: Dispatch Warehouse Order',
        type: 'action',
        category: 'http',
        description: 'Request 3PL fulfillment center to pick & package items',
        iconName: 'Package',
        config: {
          url: 'https://3pl-logistics.net/api/v1/shipments',
          method: 'POST'
        },
        nextStepIds: ['step-6']
      },
      {
        id: 'step-5',
        name: 'Slack: Flag Fraud Review Alert',
        type: 'action',
        category: 'slack',
        description: 'Alert security team to review order manually',
        iconName: 'AlertTriangle',
        config: {
          channel: '#fraud-alerts',
          message: '⚠️ Order {{trigger.order_id}} flagged for high risk score!'
        }
      },
      {
        id: 'step-6',
        name: 'Email: Send Customer Receipt',
        type: 'action',
        category: 'email',
        description: 'Send confirmation email with order summary and tracking link',
        iconName: 'Mail',
        config: {
          to: '{{trigger.customer_email}}',
          subject: 'Order Receipt #{{trigger.order_id}}'
        }
      }
    ]
  },
  {
    id: 'github-issue-triage',
    name: 'GitHub Issue Auto-Summarizer & Dev Alert',
    description: 'Extract new GitHub repository issue details, generate resolution steps via AI, and notify dev channel.',
    category: 'Engineering',
    active: false,
    createdAt: '2026-07-22T11:00:00Z',
    updatedAt: '2026-07-25T09:00:00Z',
    triggerPayload: {
      repository: 'acme/core-api',
      issue_number: 142,
      title: 'Memory leak in redis connection pool under high concurrency',
      author: 'dev-contributor',
      body: 'When hitting 5,000 req/sec, connection pool handles leak sockets without releasing idle handles.'
    },
    nodes: [
      {
        id: 'step-1',
        name: 'Webhook: New GitHub Issue',
        type: 'trigger',
        category: 'webhook',
        description: 'Fired when a bug report or issue is created on GitHub repo',
        iconName: 'GitPullRequest',
        config: {
          event: 'issues.opened'
        },
        nextStepIds: ['step-2']
      },
      {
        id: 'step-2',
        name: 'AI Agent: Propose Root Cause & Fix',
        type: 'action',
        category: 'ai',
        description: 'Analyze issue stacktrace and suggest code debugging steps',
        iconName: 'Sparkles',
        config: {
          prompt: 'Analyze issue: {{trigger.title}}\n\nDetails: {{trigger.body}}\nSuggest immediate diagnostic commands.',
          model: 'gemini-3.5-pro'
        },
        nextStepIds: ['step-3']
      },
      {
        id: 'step-3',
        name: 'Slack: Post Triage Note to #eng-bugs',
        type: 'action',
        category: 'slack',
        description: 'Notify engineering team on Slack with issue summary & AI solution',
        iconName: 'MessageSquare',
        config: {
          channel: '#eng-bugs',
          message: '🐛 Issue #{{trigger.issue_number}}: {{trigger.title}}\n\n💡 AI Diagnosis: {{step-2.suggested_fix}}'
        }
      }
    ]
  }
];

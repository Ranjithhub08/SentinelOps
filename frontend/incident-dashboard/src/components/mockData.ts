export const MOCK_INCIDENTS = [
    {
        incident_id: "F3AC400F-101",
        service: "gateway-node",
        type: "HIGH_CPU",
        severity: "HIGH",
        status: "DETECTED",
        timestamp: new Date().toISOString(),
        root_cause: "Resource Saturation",
        explanation: "Core processing units reached 98% utilization due to unexpected traffic spike.",
        suggested_action: "Scaling gateway nodes via horizontal autoscaler."
    },
    {
        incident_id: "6004DFC7-B22",
        service: "auth-service",
        type: "MEMORY_LEAK",
        severity: "CRITICAL",
        status: "DETECTED",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        root_cause: "Allocated Buffer Overflow",
        explanation: "Unreleased socket buffers in connection pool causing heap exhaustion.",
        suggested_action: "Restarting instance and rolling back to stable version v2.1.4."
    },
    {
        incident_id: "A156EE2E-D44",
        service: "payment-api",
        type: "HIGH_ERROR_RATE",
        severity: "CRITICAL",
        status: "DETECTED",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        root_cause: "Third-party Gateway Timeout",
        explanation: "Downstream payment processor 'Stripe' responding with 504 Gateway Timeouts.",
        suggested_action: "Switching to secondary payment processor 'Braintree'."
    }
];

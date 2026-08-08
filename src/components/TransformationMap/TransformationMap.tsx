import React, { useMemo } from 'react';
import { getAllDomains, getDomainById } from '../../services/domains';
import { useChatStore } from '../../store/chatStore';
import { motion } from 'framer-motion';

interface TransformationMapProps {
  onDomainSelect: (domainId: string) => void;
}

export const TransformationMap: React.FC<TransformationMapProps> = ({ onDomainSelect }) => {
  const domains = useMemo(() => getAllDomains(), []);

  // Arrange domains in a circle (10 positions)
  const nodePositions = useMemo(() => {
    const radius = 200;
    const centerX = 250;
    const centerY = 250;
    return domains.map((domain, index) => {
      const angle = (index / domains.length) * Math.PI * 2 - Math.PI / 2; // Start at top
      return {
        domain,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [domains]);

  const edges = useMemo(() => {
    const edgeList: Array<{ from: string; to: string; fromX: number; fromY: number; toX: number; toY: number }> = [];
    const positionMap = new Map(nodePositions.map((p) => [p.domain.id, { x: p.x, y: p.y }]));

    nodePositions.forEach((node) => {
      node.domain.relatedDomainIds.forEach((relatedId) => {
        const related = positionMap.get(relatedId);
        if (related) {
          // Only add edge once (from lower index to higher)
          if (node.domain.id < relatedId) {
            edgeList.push({
              from: node.domain.id,
              to: relatedId,
              fromX: node.x,
              fromY: node.y,
              toX: related.x,
              toY: related.y,
            });
          }
        }
      });
    });

    return edgeList;
  }, [nodePositions]);

  const handleDomainClick = (domainId: string) => {
    onDomainSelect(domainId);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Transformation Map
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click a domain to explore it in depth. Lines show interconnections between challenges.
        </p>
      </div>

      <svg viewBox="0 0 500 500" className="w-full max-w-2xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="rgba(156, 163, 175, 0.2)" />
          </marker>
        </defs>

        {/* Edges (interconnections) */}
        {edges.map((edge) => (
          <line
            key={`edge-${edge.from}-${edge.to}`}
            x1={edge.fromX}
            y1={edge.fromY}
            x2={edge.toX}
            y2={edge.toY}
            stroke="rgba(156, 163, 175, 0.2)"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
            className="transition-all duration-300"
          />
        ))}

        {/* Nodes (domains) */}
        {nodePositions.map((node, index) => (
          <motion.g
            key={node.domain.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            {/* Node circle background */}
            <circle
              cx={node.x}
              cy={node.y}
              r="35"
              fill={node.domain.backgroundColor}
              stroke={node.domain.color}
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 hover:r-40 hover:filter hover:drop-shadow-lg"
              onClick={() => handleDomainClick(node.domain.id)}
            />

            {/* Node emoji/icon */}
            <text
              x={node.x}
              y={node.y - 2}
              textAnchor="middle"
              fontSize="24"
              className="cursor-pointer pointer-events-none select-none"
              onClick={() => handleDomainClick(node.domain.id)}
            >
              {node.domain.icon}
            </text>

            {/* Node label */}
            <text
              x={node.x}
              y={node.y + 50}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              className="cursor-pointer pointer-events-none select-none text-gray-900 dark:text-gray-100"
              fill="currentColor"
              onClick={() => handleDomainClick(node.domain.id)}
            >
              {node.domain.name.split(' ').slice(0, 2).join(' ')}
            </text>

            {/* Tooltip on hover (SVG title) */}
            <title>{node.domain.description}</title>
          </motion.g>
        ))}
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full max-w-2xl mt-4">
        {domains.map((domain) => (
          <button
            key={domain.id}
            onClick={() => handleDomainClick(domain.id)}
            className={`text-xs font-medium p-2 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:shadow-md ${domain.backgroundColor} dark:bg-gray-700 hover:shadow-lg text-gray-900 dark:text-gray-100`}
            title={domain.description}
          >
            <span className="mr-1">{domain.icon}</span>
            {domain.name.substring(0, 12)}
          </button>
        ))}
      </div>
    </div>
  );
};

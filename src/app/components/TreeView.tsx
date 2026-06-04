import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';

interface TreeViewProps {
  data: any;
  label?: string;
  isRoot?: boolean;
}

export const TreeView: React.FC<TreeViewProps> = ({ data, label, isRoot = false }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple XML to JSON parser for display
  const parseXML = (xmlString: string): any => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      if (xmlDoc.getElementsByTagName("parsererror").length > 0) return null;
      
      const nodeToJson = (node: Node): any => {
        if (node.nodeType === Node.TEXT_NODE) return node.nodeValue?.trim() || null;
        if (node.nodeType !== Node.ELEMENT_NODE) return null;
        
        const obj: any = {};
        const element = node as Element;
        
        if (element.attributes.length > 0) {
          obj["@attributes"] = {};
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            obj["@attributes"][attr.nodeName] = attr.nodeValue;
          }
        }
        
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];
          const childJson = nodeToJson(child);
          if (childJson === null) continue;
          
          const nodeName = child.nodeName;
          if (obj[nodeName]) {
            if (!Array.isArray(obj[nodeName])) obj[nodeName] = [obj[nodeName]];
            obj[nodeName].push(childJson);
          } else {
            obj[nodeName] = childJson;
          }
        }
        
        return Object.keys(obj).length === 1 && obj["#text"] ? obj["#text"] : obj;
      };
      
      return nodeToJson(xmlDoc.documentElement);
    } catch (e) {
      return null;
    }
  };

  let displayData = data;
  if (typeof data === 'string' && data.trim().startsWith('<')) {
    const xmlJson = parseXML(data);
    if (xmlJson) displayData = xmlJson;
  }

  if (typeof displayData !== 'object' || displayData === null) {
    return (
      <div className="flex gap-2 py-0.5 group">
        {label && <span className="text-lavender-accent font-mono text-sm">{label}:</span>}
        <span className="text-lavender-text font-mono text-sm break-all">{String(displayData)}</span>
        <button onClick={handleCopy} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-lavender-surface rounded">
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
        </button>
      </div>
    );
  }

  const isArray = Array.isArray(displayData);
  const keys = Object.keys(displayData);

  return (
    <div className={cn("py-0.5", isRoot && "p-2")}>
      <div 
        className="flex items-center gap-2 cursor-pointer hover:bg-lavender-surface/50 rounded px-1 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-lavender-text/50">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
        <span className="text-lavender-accent font-mono text-sm font-bold">
          {label ? `${label}: ` : ''}
          <span className="text-lavender-text/50 font-normal">
            {isArray ? `[${displayData.length}]` : `{${keys.length}}`}
          </span>
        </span>
        <button onClick={handleCopy} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-lavender-surface rounded">
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
        </button>
      </div>
      {isOpen && (
        <div className="ml-4 border-l border-lavender-border/30 pl-3">
          {keys.map(key => (
            <TreeView key={key} data={displayData[key]} label={key} />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper for cn
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

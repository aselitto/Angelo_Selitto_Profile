'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Image from 'next/image'

// ============ GYROSCOPE CONTEXT ============
const GyroContext = createContext({ x: 0, y: 0 })

function useGyro() {
  return useContext(GyroContext)
}

// ============ METALLIC CARD WRAPPER ============
function MetallicCard({ children, className, borderColor }: { 
  children: React.ReactNode
  className?: string
  borderColor: string
}) {
  const gyro = useGyro()
  
  // Calculate shine position based on gyro
  const shineX = 50 + gyro.x * 3
  const shineY = 50 + gyro.y * 3
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${gyro.y * 0.5}deg) rotateY(${gyro.x * 0.5}deg)`,
        transition: 'transform 150ms ease-out'
      }}
    >
      {/* Metallic shine overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(ellipse 80% 50% at ${shineX}% ${shineY}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
          transition: 'background 150ms ease-out'
        }}
      />
      {children}
    </div>
  )
}

// ============ PROFILE NODE ============
function ProfileNode({ data }: NodeProps) {
  return (
    <MetallicCard className="bg-zinc-950 border-3 border-cyan-500 rounded-3xl w-[520px] shadow-2xl shadow-cyan-500/30 animate-border-cyan" borderColor="cyan">
      <div className="p-8">
        <div className="flex items-start gap-6">
          <Image
            src="/Angelo.png"
            alt="Angelo Selitto"
            width={140}
            height={140}
            className="rounded-2xl border-3 border-cyan-500/50"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-black text-white tracking-tight">ANGELO SELITTO</h1>
            <p className="text-cyan-400 text-lg font-semibold mt-2">Senior Systems Architect</p>
            <p className="text-cyan-300/70 text-sm mt-1 italic">Building correctness-first systems in regulated environments</p>
          </div>
        </div>
        
        {/* Scannable lines - 3 max */}
        <div className="mt-6 space-y-2">
          <p className="text-zinc-300 text-base">→ 25+ years across enterprise systems & healthcare IT</p>
          <p className="text-zinc-300 text-base">→ Epic EHR, Imprivata SSO, identity at national scale</p>
          <p className="text-cyan-400 text-base font-medium">→ Founder of VerifyMedCodes & Claudit (deterministic AI)</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <a href="mailto:aselitto@gmail.com" className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-medium text-white transition-colors">
            aselitto@gmail.com
          </a>
          <a href="tel:9083234643" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium text-zinc-300 transition-colors">
            (908) 323-4643
          </a>
        </div>
      </div>
    </MetallicCard>
  )
}

// ============ ERA NODE ============
interface EraData {
  theme: string
  years: string
  title: string
  subtitle: string
  items: string[]
}

function EraNode({ data }: { data: EraData }) {
  const colors: Record<string, { border: string; bg: string; text: string; glow: string }> = {
    roots: { border: 'border-green-500', bg: 'from-green-950/50', text: 'text-green-400', glow: 'shadow-green-500/20' },
    infrastructure: { border: 'border-amber-500', bg: 'from-amber-950/50', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    healthtech: { border: 'border-blue-500', bg: 'from-blue-950/50', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    ai: { border: 'border-purple-500', bg: 'from-purple-950/50', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  }
  const c = colors[data.theme] || colors.ai

  return (
    <MetallicCard className={`bg-zinc-950 border-2 ${c.border} rounded-2xl w-[340px] shadow-2xl ${c.glow}`} borderColor={data.theme}>
      <div className={`bg-gradient-to-br ${c.bg} to-zinc-900 p-5 rounded-t-xl border-b ${c.border}/30`}>
        <div className={`text-[10px] ${c.text} uppercase tracking-wider mb-1`}>{data.years}</div>
        <h2 className="text-xl font-bold text-white">{data.title}</h2>
        <p className="text-zinc-500 text-sm mt-1">{data.subtitle}</p>
      </div>
      
      <div className="p-4 space-y-3">
        {data.items?.map((item: string, i: number) => (
          <div key={i} className="flex gap-2">
            <span className={`${c.text} text-sm`}>→</span>
            <p className="text-zinc-400 text-sm leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </MetallicCard>
  )
}

// ============ PROJECT NODE ============
interface ProjectData {
  name: string
  tech: string
  description: string
  url?: string
  demoUrl?: string
  demoCaption?: string
  staticImage?: string
}

function ProjectNode({ data }: { data: ProjectData }) {
  const [showDemo, setShowDemo] = useState(true)
  
  return (
    <div className="bg-zinc-950 border-2 border-pink-500 rounded-2xl w-[900px] shadow-2xl shadow-pink-500/20 overflow-hidden animate-border-pink">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{data.name}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">{data.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-pink-500/20 text-pink-400 text-xs uppercase rounded-full">{data.tech}</span>
          {data.url && (
            <a href={data.url as string} target="_blank" className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-sm font-medium text-white transition-colors">
              Visit Site →
            </a>
          )}
          {(data.demoUrl || data.staticImage) && (
            <button 
              onClick={() => setShowDemo(!showDemo)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-300 transition-colors"
            >
              {showDemo ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
      </div>
      
      {showDemo && (data.demoUrl || data.staticImage) && (
        <div className="border-t border-pink-500/30">
          {/* Demo Caption */}
          {data.demoCaption && (
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800">
              <p className="text-zinc-400 text-xs italic">{data.demoCaption}</p>
            </div>
          )}
          
          {/* Static Image or Iframe */}
          {data.staticImage ? (
            <Image 
              src={data.staticImage} 
              alt={`${data.name} Preview`}
              width={900}
              height={600}
              className="w-full h-auto"
            />
          ) : (
            <iframe 
              src={data.demoUrl as string} 
              className="w-full h-[700px] bg-white"
              title={`${data.name} Demo`}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ============ SKILLS NODE ============
function SkillsNode({ data }: NodeProps) {
  const categories = [
    { 
      label: 'Healthcare Identity & EHR', 
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      skills: ['Epic Cadence/Prelude', 'Imprivata SSO', 'Nuance Dragon/DAX', 'Abridge', 'HL7/FHIR']
    },
    { 
      label: 'Deterministic AI & Guardrails', 
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      skills: ['Deterministic Parsing', 'RAG', 'AI Guardrails', 'OpenAI/Anthropic APIs', 'Python', 'FastAPI']
    },
    { 
      label: 'Enterprise Infrastructure', 
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      skills: ['Citrix VDI', 'Active Directory', 'Azure/O365', 'PowerShell']
    },
  ]

  return (
    <MetallicCard className="bg-zinc-950 border-2 border-emerald-500 rounded-2xl w-[380px] shadow-2xl shadow-emerald-500/20 animate-border-emerald" borderColor="emerald">
      <div className="p-4 border-b border-emerald-500/30">
        <h2 className="text-lg font-bold text-white">Technical Core</h2>
        <p className="text-zinc-500 text-xs">25+ years across enterprise systems, healthcare IT, and applied AI</p>
      </div>
      
      <div className="p-4 space-y-3">
        {categories.map((cat, i) => (
          <div key={i}>
            <div className={`text-[10px] uppercase tracking-wider mb-1.5 ${cat.color.split(' ')[1]}`}>{cat.label}</div>
            <div className="flex flex-wrap gap-1">
              {cat.skills.map((skill, j) => (
                <span key={j} className={`px-2 py-0.5 ${cat.color} text-[11px] rounded border`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MetallicCard>
  )
}

// ============ CERTIFICATIONS NODE ============
function CertsNode({ data }: NodeProps) {
  const certs = [
    { name: 'Epic Cadence & Prelude', type: 'Healthcare' },
    { name: 'MCTS, MCITP, MCSA', type: 'Microsoft' },
    { name: 'CompTIA A+ & Network+', type: 'Foundation' },
    { name: 'ITIL V3', type: 'Process' },
  ]

  return (
    <MetallicCard className="bg-zinc-950/80 border border-zinc-700 rounded-xl w-[280px] shadow-lg" borderColor="zinc">
      <div className="p-3 border-b border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-400">Credentials & Compliance Readiness</h2>
      </div>
      <div className="p-3 space-y-1.5">
        {certs.map((cert, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <span className="text-zinc-400 text-xs">{cert.name}</span>
            <span className="text-[9px] text-zinc-600 uppercase">{cert.type}</span>
          </div>
        ))}
      </div>
    </MetallicCard>
  )
}

// ============ STORY NODE ============
function StoryNode({ data }: NodeProps) {
  return (
    <div className="bg-zinc-950 border-2 border-zinc-700 rounded-2xl w-[400px] shadow-2xl">
      <div className="p-4 border-b border-zinc-700">
        <h2 className="text-lg font-bold text-white">The "IRC to AI" Origin Story</h2>
      </div>
      <div className="p-4">
        {/* TL;DR */}
        <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-lg p-3 mb-4">
          <p className="text-cyan-300 text-xs font-medium">
            TL;DR: I learned early that data integrity and determinism matter. I apply that same principle to modern AI systems in healthcare and legal domains.
          </p>
        </div>
        
        <p className="text-zinc-500 text-xs leading-relaxed italic">
          "Long before I was architecting Epic SSO integrations for 33,000 providers, I was navigating the command line of Xtree Gold and the script-heavy world of mIRC.
        </p>
        <p className="text-zinc-500 text-xs leading-relaxed mt-2 italic">
          In the 90s, if you wanted a complete file, you didn't just 'download' it. You used IRC to request packets, verified them, and manually reassembled fragmented data. That era taught me: <span className="text-cyan-400 not-italic font-medium">Data Integrity is everything.</span>
        </p>
        <p className="text-zinc-500 text-xs leading-relaxed mt-2 italic">
          Today, I apply that same 'packet-level' skepticism to LLMs. I don't trust a probabilistic LLM to write a legal contract without a deterministic guardrail."
        </p>
      </div>
    </div>
  )
}

// ============ LOOKING FOR NODE ============
function LookingForNode({ data }: NodeProps) {
  return (
    <MetallicCard className="bg-zinc-950 border-2 border-teal-500 rounded-2xl w-[340px] shadow-2xl shadow-teal-500/20 animate-border-teal" borderColor="teal">
      <div className="p-4 border-b border-teal-500/30">
        <h2 className="text-lg font-bold text-white">What I'm Looking For</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Target Roles */}
        <div>
          <div className="text-[10px] text-teal-400 uppercase tracking-wider mb-2">Target Roles</div>
          <div className="space-y-1">
            <p className="text-zinc-300 text-sm">→ Senior / Principal Solutions Architect</p>
            <p className="text-zinc-300 text-sm">→ Healthcare Integration Architect</p>
            <p className="text-zinc-300 text-sm">→ AI Platform / AI Systems Architect</p>
            <p className="text-zinc-300 text-sm">→ Identity & Access Architecture</p>
          </div>
        </div>

        {/* Engagement Types */}
        <div>
          <div className="text-[10px] text-teal-400 uppercase tracking-wider mb-2">Engagement Types</div>
          <div className="space-y-1">
            <p className="text-zinc-400 text-sm">→ Full-time (Remote-first)</p>
            <p className="text-zinc-400 text-sm">→ Contract-to-Hire</p>
            <p className="text-zinc-400 text-sm">→ Architecture & integration engagements</p>
          </div>
        </div>

        {/* Focus Areas */}
        <div>
          <div className="text-[10px] text-teal-400 uppercase tracking-wider mb-2">Focus Areas</div>
          <div className="space-y-1">
            <p className="text-zinc-400 text-sm">→ Healthcare IT, EHR, identity & SSO</p>
            <p className="text-zinc-400 text-sm">→ Deterministic AI in regulated environments</p>
            <p className="text-zinc-400 text-sm">→ Correctness, auditability, and scale</p>
          </div>
        </div>

        {/* Availability */}
        <div className="pt-2 border-t border-zinc-800">
          <p className="text-teal-300 text-xs font-medium">📅 Available for interviews immediately</p>
          <p className="text-teal-300/80 text-xs mt-1">⏱ Can start contract or FTE within 2–4 weeks</p>
          <p className="text-zinc-500 text-xs mt-1">Based in PA · Remote preferred</p>
        </div>
      </div>
      
      {/* Micro CTA */}
      <div className="bg-teal-950/30 px-4 py-3 border-t border-teal-500/20">
        <p className="text-zinc-400 text-xs italic">
          If you're hiring for any of the above, I'm happy to talk.
        </p>
      </div>
    </MetallicCard>
  )
}

// ============ NODE TYPES ============
const nodeTypes = {
  profile: ProfileNode,
  era: EraNode,
  project: ProjectNode,
  skills: SkillsNode,
  certs: CertsNode,
  story: StoryNode,
  lookingFor: LookingForNode,
}

// ============ INITIAL NODES ============
const initialNodes: Node[] = [
  // Profile - Top Left
  {
    id: 'profile',
    type: 'profile',
    position: { x: -100, y: -12 },
    data: {}
  },
  
  // Timeline Eras - Horizontal flow
  {
    id: 'era-roots',
    type: 'era',
    position: { x: 450, y: -12 },
    data: {
      theme: 'roots',
      years: '1998 - 2004',
      title: 'The 56k Roots',
      subtitle: 'DOS, Xtree Gold, mIRC, GOES ISP',
      items: [
        'Managed 56k dial-up infrastructure',
        'Windows 95/98 deployments',
        'TCP/IP fundamentals from the ground up'
      ]
    }
  },
  {
    id: 'era-infra',
    type: 'era',
    position: { x: 811, y: -12 },
    data: {
      theme: 'infrastructure',
      years: '2005 - 2014',
      title: 'The Infrastructure Era',
      subtitle: 'Active Directory, Server 2008, eCommerce',
      items: [
        'Server 2008 AD/Group Policies',
        'Built eCommerce sites from scratch',
        'Custom inventory management systems'
      ]
    }
  },
  {
    id: 'era-health',
    type: 'era',
    position: { x: 1179, y: -14 },
    data: {
      theme: 'healthtech',
      years: '2014 - 2021',
      title: 'The Epic/EHR Era',
      subtitle: "St. Luke's, LVHN, Cadence Certification",
      items: [
        '10,000-PC Dragon Medical deployment',
        'Epic Cadence/Prelude certified',
        'Scheduling for 300+ clinics'
      ]
    }
  },
  {
    id: 'era-ai',
    type: 'era',
    position: { x: 1554, y: -17 },
    data: {
      theme: 'ai',
      years: '2021 - Present',
      title: 'The AI Pivot',
      subtitle: 'OCHIN, Imprivata, Claudit, VerifyMedCodes',
      items: [
        'SSO for 200+ service areas, 33,000 providers',
        'Clinical AI tools: Nuance DAX, Abridge',
        'Built deterministic AI guardrails'
      ]
    }
  },

  // Projects - Spread out
  {
    id: 'project-claudit',
    type: 'project',
    position: { x: 41, y: 823 },
    data: {
      name: 'Claudit',
      tech: 'FastAPI + React',
      description: 'Deterministic contract clarity engine for AI agents — flags legal ambiguity with zero hallucination risk.',
      url: 'https://claudit.netlify.app',
      demoUrl: 'https://claudit.netlify.app',
      demoCaption: 'Interactive demo – Accept EULA, then click "Example" button (bottom right) to see analysis'
    }
  },
  {
    id: 'project-verify',
    type: 'project',
    position: { x: 1929, y: -14 },
    data: {
      name: 'VerifyMedCodes.ai',
      tech: 'RAG + AI',
      description: 'Clinical dictation → audit-ready billing with zero hallucination risk. ICD/CPT validation via deterministic RAG.',
      url: 'https://notes.verifymedcodes.ai',
      demoUrl: 'https://verifymedcodes.ai'
    }
  },
  {
    id: 'project-resid',
    type: 'project',
    position: { x: 989, y: 822 },
    data: {
      name: 'ResidStream',
      tech: 'Logit Lens + 3D',
      description: 'Navigable 3D environment for exploring GPT-2 residual streams. Visualize attention heads, induction circuits, and token competition in real-time.',
      url: 'https://aselitto.github.io/ResidStream/',
      demoUrl: 'https://aselitto.github.io/ResidStream/',
      demoCaption: 'Right-click to pan/look around • Try the Harry Potter induction head preset'
    }
  },
  {
    id: 'project-swing',
    type: 'project',
    position: { x: 1927, y: 817 },
    data: {
      name: 'Swing-Form-AI',
      tech: 'CV + LLM',
      description: 'Computer vision + LLM for real-time biomechanical analysis. Physical sensor data → actionable coaching insights.',
      url: 'https://swing-form-ai.netlify.app',
      demoUrl: 'https://swing-form-ai.netlify.app'
    }
  },

  // Skills
  {
    id: 'skills',
    type: 'skills',
    position: { x: 39, y: 466 },
    data: {}
  },
  
  // Certs
  {
    id: 'certs',
    type: 'certs',
    position: { x: 868, y: 261 },
    data: {}
  },

  // Story
  {
    id: 'story',
    type: 'story',
    position: { x: 447, y: 256 },
    data: {}
  },

  // What I'm Looking For - fills the gap
  {
    id: 'looking-for',
    type: 'lookingFor',
    position: { x: 1179, y: 252 },
    data: {}
  },
]

// ============ INITIAL EDGES ============
const initialEdges: Edge[] = [
  // Timeline connections
  { id: 'e-roots-infra', source: 'era-roots', target: 'era-infra', style: { stroke: '#22c55e', strokeWidth: 2 }, animated: true },
  { id: 'e-infra-health', source: 'era-infra', target: 'era-health', style: { stroke: '#f59e0b', strokeWidth: 2 }, animated: true },
  { id: 'e-health-ai', source: 'era-health', target: 'era-ai', style: { stroke: '#3b82f6', strokeWidth: 2 }, animated: true },
  
  // Profile to timeline
  { id: 'e-profile-roots', source: 'profile', target: 'era-roots', style: { stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '5,5' } },
  
  // AI era to projects
  { id: 'e-ai-claudit', source: 'era-ai', target: 'project-claudit', style: { stroke: '#a855f7', strokeWidth: 1 } },
  { id: 'e-ai-verify', source: 'era-ai', target: 'project-verify', style: { stroke: '#a855f7', strokeWidth: 1 } },
]

// ============ MAIN COMPONENT ============
export default function SpatialResume() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  // Detect mobile for disabling node drag
  const [isMobile, setIsMobile] = useState(false)
  
  // Gyroscope state for individual cards
  const [gyro, setGyro] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Gyroscope listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const x = Math.max(-15, Math.min(15, (e.gamma || 0) * 0.5))
      const y = Math.max(-15, Math.min(15, (e.beta || 0) * 0.5 - 15))
      setGyro({ x, y })
    }
    
    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [])

  return (
    <GyroContext.Provider value={gyro}>
      <div className="w-screen h-screen bg-black">
        <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultViewport={{ x: 50, y: 50, zoom: 0.6 }}
        minZoom={0.05}
        maxZoom={4}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnDrag={true}
        nodesDraggable={!isMobile}
      >
        <Background color="#27272a" gap={30} />
        <Controls className="!bg-zinc-900 !border-zinc-700 !rounded-xl overflow-hidden [&>button]:!bg-zinc-800 [&>button]:!border-zinc-700 [&>button:hover]:!bg-zinc-700" />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'profile') return '#06b6d4'
            if (node.type === 'era') return '#a855f7'
            if (node.type === 'project') return '#ec4899'
            if (node.type === 'skills') return '#10b981'
            return '#71717a'
          }}
          className="!bg-zinc-900 !border-zinc-700 rounded-xl"
        />
      </ReactFlow>
      
        {/* Floating Header */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 text-center">
          <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 rounded-full px-4 py-2">
            <span className="text-zinc-400 text-xs md:text-sm">Pinch to zoom • Drag to pan</span>
          </div>
        </div>
      </div>
    </GyroContext.Provider>
  )
}

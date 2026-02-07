'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ProcessStep, ProcessPhase } from '@/data/projects';

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

const phaseColors: Record<ProcessPhase, { bg: string; border: string; text: string }> = {
  '企画': { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  '制作': { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
  '評価': { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
};

const phaseDotColors: Record<ProcessPhase, string> = {
  '企画': 'bg-blue-500',
  '制作': 'bg-green-500',
  '評価': 'bg-amber-500',
};

export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  // Group steps by phase
  const groupedSteps = steps.reduce((acc, step) => {
    if (!acc[step.phase]) {
      acc[step.phase] = [];
    }
    acc[step.phase].push(step);
    return acc;
  }, {} as Record<ProcessPhase, ProcessStep[]>);

  const phases: ProcessPhase[] = ['企画', '制作', '評価'];
  const availablePhases = phases.filter(phase => groupedSteps[phase]);

  return (
    <div className="space-y-8">
      {availablePhases.map((phase, phaseIndex) => (
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: phaseIndex * 0.1 }}
        >
          {/* Phase Header */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${phaseColors[phase].bg} ${phaseColors[phase].text} ${phaseColors[phase].border} border`}
            >
              {phase}
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Steps */}
          <div className="relative pl-6">
            {/* Vertical Line */}
            <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-neutral-200" />

            <div className="space-y-6">
              {groupedSteps[phase].map((step, stepIndex) => (
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: phaseIndex * 0.1 + stepIndex * 0.05 }}
                  className="relative"
                >
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-1.5 w-[18px] h-[18px] rounded-full ${phaseDotColors[phase]} border-4 border-white shadow-sm`}
                  />

                  {/* Content */}
                  <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors">
                    <h4 className="font-bold text-neutral-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">{step.description}</p>
                    {step.images && step.images.length > 0 && (
                      <div className={`mt-4 grid gap-2 ${step.images.length === 1 ? 'grid-cols-1' : step.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                        {step.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative aspect-video bg-neutral-100 rounded overflow-hidden">
                            <Image
                              src={image}
                              alt={`${step.title} - ${imgIndex + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, Award } from 'lucide-react';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="aspect-video relative bg-muted overflow-hidden">
            {project.images[0] ? (
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ImageIcon className="w-12 h-12" />
              </div>
            )}
            {project.awards && project.awards.length > 0 && (
              <div className="absolute top-3 right-3">
                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                  <Award className="w-3 h-3 mr-1" />
                  Award
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                {project.category === 'web' ? 'Web' : 'Electronics'}
              </Badge>
              <span className="text-xs text-muted-foreground">{project.period}</span>
            </div>
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.subtitle}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.article>
  );
}

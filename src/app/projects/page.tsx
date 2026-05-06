'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import ProjectCard from '@/components/ProjectCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { categories, type ProjectCategory, type Project } from '@/data/projects';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(json => {
        const mapped: Project[] = (json.projects ?? []).map((p: Record<string, unknown>) => ({
          slug: p.slug as string,
          title: p.title as string,
          subtitle: (p.subtitle as string) ?? '',
          category: p.category as ProjectCategory,
          period: (p.period as string) ?? '',
          description: (p.description as string) ?? '',
          roles: (p.roles as string[]) ?? [],
          tools: (p.tools as string[]) ?? [],
          highlights: (p.highlights as string[]) ?? [],
          images: p.thumbnail ? [p.thumbnail as string] : [],
        }));
        setProjects(mapped);
      })
      .catch(() => setProjects([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Projects</h1>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            2004年から2022年にかけて携わったプロジェクトの一覧です。
            ウェブサービス開発と電気機器業界の2つのカテゴリに分けて紹介しています。
          </p>

          {/* Category Filter */}
          <Tabs
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as ProjectCategory | 'all')}
            className="mb-12"
          >
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-5 h-5 border border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.slug} project={project} index={index} />
                ))}
              </div>
              {filteredProjects.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  該当するプロジェクトがありません。
                </div>
              )}
            </>
          )}
        </motion.div>
      </Container>
    </div>
  );
}

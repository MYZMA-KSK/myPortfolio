'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import ProjectCard from '@/components/ProjectCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { projects, categories, type ProjectCategory } from '@/data/projects';

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');

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
        </motion.div>
      </Container>
    </div>
  );
}

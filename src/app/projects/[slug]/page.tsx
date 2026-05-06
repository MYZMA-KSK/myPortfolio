'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import ProcessTimeline from '@/components/ProcessTimeline';
import Lightbox from '@/components/Lightbox';
import { type ProcessPhase } from '@/data/projects';

type ProcessStep = {
  phase: ProcessPhase;
  title: string;
  description: string;
};

type ProjectDetail = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'web' | 'electronics';
  period: string;
  roles: string[];
  tools: string[];
  highlights: string[];
  images: string[];
  processSteps: ProcessStep[];
  url?: string;
  awards?: string[];
};

type ProjectSummary = {
  slug: string;
  title: string;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [prevProject, setPrevProject] = useState<ProjectSummary | null>(null);
  const [nextProject, setNextProject] = useState<ProjectSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const [detailRes, allRes] = await Promise.all([
        fetch(`/api/projects?slug=${encodeURIComponent(slug)}`),
        fetch('/api/projects'),
      ]);

      const [detailJson, allJson] = await Promise.all([
        detailRes.json(),
        allRes.json(),
      ]);

      if (!detailRes.ok || !detailJson.project) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      setProject(detailJson.project);

      // API already returns projects sorted by period desc
      const allProjects: ProjectSummary[] = allJson.projects ?? [];
      const idx = allProjects.findIndex((p: ProjectSummary) => p.slug === slug);
      setPrevProject(idx > 0 ? allProjects[idx - 1] : null);
      setNextProject(idx < allProjects.length - 1 ? allProjects[idx + 1] : null);
      setIsLoading(false);
    }
    load();
  }, [slug]);

  const openLightbox = (index: number) => { setLightboxIndex(index); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const goToPrev = () => setLightboxIndex((prev) => (prev === 0 ? (project?.images.length ?? 1) - 1 : prev - 1));
  const goToNext = () => setLightboxIndex((prev) => (prev === (project?.images.length ?? 1) - 1 ? 0 : prev + 1));

  if (isLoading) {
    return (
      <div className="py-16 md:py-24">
        <Container>
          <div className="flex items-center justify-center py-24">
            <div className="w-5 h-5 border border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
          </div>
        </Container>
      </div>
    );
  }

  if (isNotFound || !project) {
    notFound();
  }

  return (
    <div className="py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-neutral-500">
              <li>
                <Link href="/" className="hover:text-neutral-900">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/projects" className="hover:text-neutral-900">
                  Projects
                </Link>
              </li>
              <li>/</li>
              <li className="text-neutral-900">{project.title}</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {project.category === 'web' ? 'ウェブサービス開発' : '電気機器業界'}
              </span>
              <span className="text-sm text-neutral-500">{project.period}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-neutral-600">{project.subtitle}</p>
          </header>

          {/* Main Image */}
          {project.images.length > 0 && (
            <div className="mb-12">
              <button
                onClick={() => openLightbox(0)}
                className="w-full aspect-video relative bg-neutral-100 rounded-lg overflow-hidden cursor-zoom-in group"
              >
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                    クリックで拡大
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Awards */}
          {project.awards && project.awards.length > 0 && (
            <div className="mb-12 p-6 bg-neutral-50 rounded-lg">
              <h2 className="font-semibold text-neutral-900 mb-2">受賞歴</h2>
              <ul className="space-y-1">
                {project.awards.map((award, index) => (
                  <li key={index} className="text-neutral-600">
                    {award}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <section className="mb-12">
                <h2 className="text-xl font-bold mb-4">概要</h2>
                <p className="text-neutral-600 leading-relaxed">
                  {project.description}
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-xl font-bold mb-4">担当業務</h2>
                <ul className="space-y-2">
                  {project.roles.map((role, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-neutral-600">{role}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-xl font-bold mb-4">ハイライト</h2>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-neutral-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Process Timeline */}
              {project.processSteps && project.processSteps.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xl font-bold mb-6">取り組みのプロセス</h2>
                  <ProcessTimeline steps={project.processSteps} />
                </section>
              )}

              {/* Gallery */}
              {project.images.length > 1 && (
                <section className="mb-12">
                  <h2 className="text-xl font-bold mb-4">ギャラリー</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {project.images.slice(1).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => openLightbox(index + 1)}
                        className="aspect-video relative bg-neutral-100 rounded-lg overflow-hidden cursor-zoom-in group"
                      >
                        <Image
                          src={image}
                          alt={`${project.title} - ${index + 2}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {project.tools.length > 0 && (
                  <div className="bg-white p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">使用ツール</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tools.map((tool) => (
                        <span
                          key={tool}
                          className="bg-neutral-100 text-neutral-700 text-sm px-3 py-1 rounded-full"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.url && (
                  <div className="bg-white p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">関連リンク</h3>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                    >
                      製品情報を見る
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* Navigation */}
          <nav className="mt-16 pt-8 border-t border-neutral-200">
            <div className="flex justify-between">
              {prevProject ? (
                <Link
                  href={`/projects/${prevProject.slug}`}
                  className="group flex items-center text-neutral-600 hover:text-neutral-900"
                >
                  <svg
                    className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <div>
                    <div className="text-xs text-neutral-400">前のプロジェクト</div>
                    <div className="font-medium">{prevProject.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextProject ? (
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="group flex items-center text-right text-neutral-600 hover:text-neutral-900"
                >
                  <div>
                    <div className="text-xs text-neutral-400">次のプロジェクト</div>
                    <div className="font-medium">{nextProject.title}</div>
                  </div>
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        </motion.div>
      </Container>

      {/* Lightbox */}
      <Lightbox
        images={project.images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onPrev={goToPrev}
        onNext={goToNext}
        alt={project.title}
      />
    </div>
  );
}

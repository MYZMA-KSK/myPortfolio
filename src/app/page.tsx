'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import AbstractAnimation from '@/components/AbstractAnimation';

export default function Home() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center bg-white overflow-hidden">
      <AbstractAnimation />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl relative z-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            宮島敬右
            <span className="block text-2xl md:text-3xl font-normal text-neutral-500 mt-2">
              UI/UX Designer
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 leading-relaxed mb-8">
            2004年から2022年にかけて、ウェブサービス開発と電気機器業界で
            <br className="hidden md:block" />
            UIデザイン・UXデザインを担当してきました。
            <br className="hidden md:block" />
            人間中心設計のプロセスに基づいた、使いやすく美しいインターフェースの設計を得意としています。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              プロジェクトを見る
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

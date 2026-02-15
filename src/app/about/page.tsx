'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Briefcase, Sparkles } from 'lucide-react';

const experience = [
  {
    period: '2016年〜2022年',
    company: 'ウェブサービス開発',
    role: 'UI/UXデザイナー',
    description: 'SiTest、FasTest、SPAIAなどのウェブサービスのUIデザインを担当。デザインシステムの構築、ユーザビリティテストの実施、テクニカルライティングなど幅広い業務を経験。',
  },
  {
    period: '2004年〜2016年',
    company: '電気機器業界',
    role: 'UI/UXデザイナー / プロダクトデザイナー',
    description: 'テレビ視聴アプリ、ゴルフスイング改善ツール、IoTデバイスアプリなどのUIデザインを担当。ハードウェアの外観デザインや製品パッケージデザインも経験。',
  },
];

const skills = [
  {
    category: 'UIデザイン',
    items: [
      '画面設計・情報設計',
      '画面遷移設計',
      'デザインシステム構築',
      'デザインガイドライン作成',
      'プロトタイプ作成',
      'ビジュアルデザイン',
    ],
  },
  {
    category: 'UXデザイン',
    items: [
      '人間中心設計（HCD）',
      'ユーザーリサーチ',
      'ユーザーインタビュー',
      'ペルソナ設計',
      'ユーザーストーリーマップ',
      'ユーザビリティテスト',
    ],
  },
  {
    category: 'ツール',
    items: [
      'Figma',
      'Sketch',
      'Adobe XD',
      'Adobe After Effects',
      'Zeplin',
      'Whimsical / Prott',
    ],
  },
  {
    category: 'その他',
    items: [
      'テクニカルライティング',
      'ブランディング',
      'ロゴデザイン',
      'パッケージデザイン',
      'プロダクトデザイン',
      'フロントエンド連携',
    ],
  },
];

const awards = [
  {
    year: '2015',
    title: 'GOOD DESIGN賞',
    project: 'Plane Analyzer Plus',
    description: 'ゴルフスイング改善ツールのセンサーとアプリのデザイン',
  },
  {
    year: '2014',
    title: 'GOOD DESIGN賞',
    project: 'StationTV フリックカード選局インターフェース',
    description: 'タッチ操作に最適化したテレビ選局UI',
  },
  {
    year: '2016',
    title: 'HCDグッドプラクティスアウォード 9選',
    project: 'Plane Analyzer Plus',
    description: '人間中心設計プロセスの実践が評価',
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About</h1>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            UI/UXデザイナーとして18年以上の経験を持ち、
            ウェブサービスから家電製品まで幅広いプロダクトのデザインに携わってきました。
          </p>

          {/* Profile */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">プロフィール</h2>
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-48 md:h-48 w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/profile.jpg"
                      alt="Keisuke Miyajima"
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">宮島 敬右</h3>
                    <p className="text-muted-foreground mb-4">Keisuke Miyajima</p>
                    <p className="text-muted-foreground leading-relaxed">
                      2004年から電気機器メーカーでUIデザイナーとしてキャリアをスタート。
                      テレビ視聴アプリやゴルフスイング改善ツールなど、様々なプロダクトのUIデザインを担当。
                      2016年以降はウェブサービス開発に携わり、SiTestやFasTestなどのSaaS製品のUIデザインを担当。
                      <br /><br />
                      人間中心設計（HCD）のプロセスを重視し、ユーザーリサーチからプロトタイピング、
                      ユーザビリティテストまで一貫して行うことで、使いやすく価値のあるプロダクトの実現を目指しています。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Experience */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              経歴
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <Badge variant="secondary" className="w-fit">
                          {exp.period}
                        </Badge>
                        <div>
                          <h3 className="font-bold text-lg">{exp.company}</h3>
                          <p className="text-muted-foreground text-sm">{exp.role}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              スキル
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{skill.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid grid-cols-2 gap-2">
                        {skill.items.map((item) => (
                          <li key={item} className="text-muted-foreground text-sm flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Awards */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Award className="w-6 h-6" />
              受賞歴
            </h2>
            <div className="space-y-4">
              {awards.map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <span className="text-2xl font-bold text-neutral-900">{award.year}</span>
                        <div>
                          <h3 className="font-bold text-lg text-neutral-900">{award.title}</h3>
                          <p className="text-neutral-700">{award.project}</p>
                          <p className="text-neutral-500 text-sm mt-1">{award.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </Container>
    </div>
  );
}

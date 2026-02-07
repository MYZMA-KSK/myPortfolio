interface SkillBadgeProps {
  skill: string;
}

export default function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <span className="inline-block bg-neutral-100 text-neutral-700 text-sm px-3 py-1 rounded-full">
      {skill}
    </span>
  );
}

"use client";

import ExperienceRail from "@/components/ExperienceRail";
import ExperienceTilt from "@/components/ExperienceTilt";
import GsapReveal from "@/components/GsapReveal";
import ExperienceCard, { type Experience } from "@/components/ExperienceCard";

export default function ExperienceList({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="relative">
      <ExperienceRail />

      <ul className="relative space-y-5 pl-12 sm:pl-16">
        {experiences.map((exp, index) => (
          <li key={exp.id} className="relative">
            {/* Timeline dot */}
            <GsapReveal delay={index * 0.12} y={30} rotateX={-22}>
              {/* Card */}
              <ExperienceTilt>
                <ExperienceCard exp={exp} />
              </ExperienceTilt>
            </GsapReveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

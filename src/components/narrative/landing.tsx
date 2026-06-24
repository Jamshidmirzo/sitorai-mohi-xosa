"use client";

import { useState } from "react";
import {
  NarrativeRoot,
  NarrativeScroller,
} from "./narrative-root";
import { TopNav } from "./top-nav";
import { MobileMenu } from "./mobile-menu";
import { Hero } from "./hero";
import { Story } from "./story";
import { WhiteHall } from "./white-hall";
import { Museums } from "./museums";
import { Collection } from "./collection";
import { Visit } from "./visit";
import { ExhibitDetail } from "./exhibit-detail";
import { useIsMobile } from "./use-mobile";
import type { Exhibit, QuizQuestion } from "@/lib/narrative-types";

function LandingBody({
  exhibits,
  quizByExhibit,
}: {
  exhibits: Exhibit[];
  quizByExhibit: Record<string, QuizQuestion[]>;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const isMobile = useIsMobile();
  return (
    <>
      {!isMobile && <TopNav />}
      <MobileMenu />
      <NarrativeScroller>
        <Hero />
        <Story />
        <WhiteHall />
        <Museums />
        <Collection
          exhibits={exhibits}
          onOpen={(i) => setSelected(i)}
        />
        <Visit />
      </NarrativeScroller>
      {selected !== null && (
        <ExhibitDetail
          selected={selected}
          exhibits={exhibits}
          quizByExhibit={quizByExhibit}
          onClose={() => setSelected(null)}
          onSelect={(i) => setSelected(i)}
        />
      )}
    </>
  );
}

export function Landing({
  exhibits,
  quizByExhibit,
}: {
  exhibits: Exhibit[];
  quizByExhibit: Record<string, QuizQuestion[]>;
}) {
  return (
    <NarrativeRoot>
      <LandingBody exhibits={exhibits} quizByExhibit={quizByExhibit} />
    </NarrativeRoot>
  );
}

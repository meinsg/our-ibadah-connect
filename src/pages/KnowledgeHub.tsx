import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, X, ArrowLeft, Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Article {
  id: string;
  title: string;
  category: "dua" | "article" | "adhkar";
  excerpt: string;
  content: string;
  arabic?: string;
}

const articles: Article[] = [
  {
    id: "dua-morning",
    title: "Morning Supplications",
    category: "dua",
    excerpt: "Essential duas to start your day with blessings.",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    content:
      "Starting your morning with remembrance of Allah sets the tone for a blessed day.\n\n**Dua 1:** أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ\n\"We have reached the morning and at this very time the whole kingdom belongs to Allah. All praise is for Allah.\"\n\n**Dua 2:** اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ\n\"O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.\"",
  },
  {
    id: "dua-evening",
    title: "Evening Supplications",
    category: "dua",
    excerpt: "Duas for protection and peace in the evening.",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
    content:
      "The evening adhkar provide protection and tranquility before rest.\n\n**Dua 1:** أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ\n\"We have reached the evening and at this very time the whole kingdom belongs to Allah.\"\n\n**Dua 2:** اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحُزْنِ\n\"O Allah, I seek refuge in You from worry and grief.\"",
  },
  {
    id: "dua-travel",
    title: "Dua for Travelling",
    category: "dua",
    excerpt: "Supplications for a safe journey.",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا",
    content:
      "When embarking on a journey, the Prophet ﷺ would recite:\n\nسُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ\n\n\"Glory be to the One Who has subjected this for us, for we could never have done so on our own. And surely to our Lord we will return.\"",
  },
  {
    id: "dua-food",
    title: "Dua Before & After Eating",
    category: "dua",
    excerpt: "Remember Allah before and after meals.",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    content:
      "**Before eating:** بِسْمِ اللَّهِ\n\"In the name of Allah.\"\n\nIf you forget at the start: بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ\n\n**After eating:** الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ\n\"Praise be to Allah Who fed us and gave us drink, and made us Muslims.\"",
  },
  {
    id: "article-salah",
    title: "The Importance of Salah",
    category: "article",
    excerpt: "Understanding why prayer is the pillar of Islam.",
    content:
      "Salah is the second pillar of Islam and the most important act of worship after the Shahada. The Prophet ﷺ said:\n\n\"The first matter that the slave will be brought to account for on the Day of Judgment is the prayer.\"\n\nPrayer is a direct connection between the believer and Allah. It provides spiritual nourishment, discipline, and a sense of purpose throughout the day.\n\n**Benefits of Regular Prayer:**\n- Spiritual purification and peace of mind\n- Structure and discipline in daily life\n- Community bonding through congregational prayers\n- A constant reminder of our purpose",
  },
  {
    id: "article-ramadan",
    title: "Maximizing Ramadan",
    category: "article",
    excerpt: "Practical tips for getting the most out of Ramadan.",
    content:
      "Ramadan is a blessed month of fasting, prayer, and reflection. Here are ways to maximize its blessings:\n\n**1. Set Clear Goals:** Decide what you want to achieve — completing Quran, extra prayers, or breaking bad habits.\n\n**2. Plan Your Days:** Structure your time around prayers, meals, and worship.\n\n**3. Increase Quran Recitation:** Aim to read at least one juz per day.\n\n**4. Give Generously:** The Prophet ﷺ was most generous in Ramadan.\n\n**5. Make Dua:** Especially during the last ten nights.",
  },
  {
    id: "adhkar-sleep",
    title: "Adhkar Before Sleep",
    category: "adhkar",
    excerpt: "Remembrances recommended before going to sleep.",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    content:
      "The Prophet ﷺ taught us several adhkar before sleeping:\n\n**1.** Recite Ayatul Kursi — protection through the night.\n\n**2.** Recite the last two ayat of Surah Al-Baqarah.\n\n**3.** بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا\n\"In Your name O Allah, I die and I live.\"\n\n**4.** Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas three times each, then blow into your palms and wipe over your body.",
  },
  {
    id: "adhkar-masjid",
    title: "Adhkar for Entering the Masjid",
    category: "adhkar",
    excerpt: "What to say when entering and leaving the mosque.",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    content:
      "**When entering:** اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ\n\"O Allah, open the doors of Your mercy for me.\"\n\nEnter with the right foot first.\n\n**When leaving:** اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ\n\"O Allah, I ask You from Your bounty.\"\n\nLeave with the left foot first.",
  },
];

const categoryLabels: Record<string, string> = {
  dua: "Duas",
  article: "Articles",
  adhkar: "Adhkar",
};

const KnowledgeHub = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  const filtered = articles.filter((a) => {
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Reading mode
  if (readingArticle) {
    return (
      <div className="has-bottom-nav min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReadingArticle(null)}
            className="mb-4 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("knowledge.back")}
          </Button>

          <div className="mb-2">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              {categoryLabels[readingArticle.category]}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-4 font-amiri">
            {readingArticle.title}
          </h1>

          {readingArticle.arabic && (
            <Card className="p-6 mb-6 bg-primary/5 border-primary/10 text-center">
              <p className="text-2xl font-amiri text-foreground leading-loose" dir="rtl">
                {readingArticle.arabic}
              </p>
            </Card>
          )}

          <div className="prose prose-sm max-w-none">
            {readingArticle.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-foreground/80 leading-relaxed mb-4 text-sm">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="has-bottom-nav min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("knowledge.title")}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t("knowledge.subtitle")}</p>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("knowledge.searchPlaceholder")}
            className="pl-10 bg-card border-border"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[null, "dua", "article", "adhkar"].map((cat) => (
            <Button
              key={cat ?? "all"}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="text-xs shrink-0 rounded-full"
            >
              {cat ? categoryLabels[cat] : t("knowledge.all")}
            </Button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-3">
          {filtered.map((article) => (
            <Card
              key={article.id}
              className="p-4 border-border hover:shadow-prayer transition-all cursor-pointer touch-manipulation"
              onClick={() => setReadingArticle(article)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                  {article.category === "dua" ? (
                    <Star className="h-4 w-4" />
                  ) : (
                    <BookOpen className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-medium text-primary uppercase tracking-wide">
                      {categoryLabels[article.category]}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 truncate">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{article.excerpt}</p>
                </div>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">{t("knowledge.noResults")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHub;

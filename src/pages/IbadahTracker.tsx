import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, BookOpen, Moon, Sun, RotateCcw } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface TrackerItem {
  id: string;
  label: string;
  category: "salah" | "quran" | "adhkar";
  completed: boolean;
}

const defaultItems: Omit<TrackerItem, "completed">[] = [
  { id: "fajr", label: "Fajr", category: "salah" },
  { id: "dhuhr", label: "Dhuhr", category: "salah" },
  { id: "asr", label: "Asr", category: "salah" },
  { id: "maghrib", label: "Maghrib", category: "salah" },
  { id: "isha", label: "Isha", category: "salah" },
  { id: "quran", label: "Quran Reading", category: "quran" },
  { id: "morning-adhkar", label: "Morning Adhkar", category: "adhkar" },
  { id: "evening-adhkar", label: "Evening Adhkar", category: "adhkar" },
];

const getTodayKey = () => new Date().toISOString().split("T")[0];

const loadTracker = (): TrackerItem[] => {
  try {
    const key = `ibadah-tracker-${getTodayKey()}`;
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultItems.map((item) => ({ ...item, completed: false }));
};

const saveTracker = (items: TrackerItem[]) => {
  const key = `ibadah-tracker-${getTodayKey()}`;
  localStorage.setItem(key, JSON.stringify(items));
};

const IbadahTracker = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<TrackerItem[]>(loadTracker);

  useEffect(() => {
    saveTracker(items);
  }, [items]);

  const toggle = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  const resetAll = () => {
    setItems(defaultItems.map((item) => ({ ...item, completed: false })));
  };

  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const progress = Math.round((completed / total) * 100);

  const categories = [
    { key: "salah" as const, icon: Moon, label: t("tracker.salah") },
    { key: "quran" as const, icon: BookOpen, label: t("tracker.quran") },
    { key: "adhkar" as const, icon: Sun, label: t("tracker.adhkar") },
  ];

  return (
    <div className="has-bottom-nav min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("tracker.title")}</h1>
            <p className="text-sm text-muted-foreground">{getTodayKey()}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={resetAll} className="text-muted-foreground">
            <RotateCcw className="h-4 w-4 mr-1" />
            {t("tracker.reset")}
          </Button>
        </div>

        {/* Progress Ring */}
        <Card className="p-6 mb-6 border-border">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{progress}%</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {completed}/{total} {t("tracker.completed")}
              </p>
              <p className="text-sm text-muted-foreground">
                {progress === 100 ? t("tracker.allDone") : t("tracker.keepGoing")}
              </p>
            </div>
          </div>
        </Card>

        {/* Category sections */}
        {categories.map(({ key, icon: Icon, label }) => {
          const categoryItems = items.filter((i) => i.category === key);
          return (
            <div key={key} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">{label}</h2>
              </div>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all touch-manipulation ${
                      item.completed
                        ? "bg-primary/5 border-primary/20"
                        : "bg-card border-border hover:border-primary/30"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        item.completed
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {item.completed && (
                        <CheckSquare className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        item.completed ? "text-primary line-through" : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IbadahTracker;

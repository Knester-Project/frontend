import { motion } from "framer-motion";

// Utils
import { cn } from "@/lib/utils";

// Icons
import { type Icon, InfoCircle } from "iconsax-reactjs"


type GuidelineItem = {
  title: string;
  description?: string;
};

type SectionProps = {
  title: string;
  variant: "do" | "dont" | "info";
  Icon: Icon;
  items: GuidelineItem[];
  index: number;
}

export default function GuidelineSection({ title, variant = "info", Icon = InfoCircle, items = [], index = 0 }: SectionProps) {
  const styles = {
    do: {
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      bullet: "bg-emerald-500",
      label: "Do",
    },
    dont: {
      badge: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      iconBg: "bg-red-500/10 text-red-600 dark:text-red-400",
      bullet: "bg-red-500",
      label: "Don't",
    },
    info: {
      badge: "bg-primary/10 text-primary border-primary/20",
      iconBg: "bg-primary/10 text-primary",
      bullet: "bg-primary",
      label: "Tip",
    },
  };
  const s = styles[variant];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="bg-card shadow-sm border border-border rounded-2xl overflow-hidden"
    >
      {/* Section header */}
      <div className="flex items-center gap-3 bg-muted/30 px-4 md:px-5 xl:px-6 py-4 border-border border-b">
        <div className={cn("flex justify-center items-center rounded-xl size-8 md:size-9 xl:size-10", s.iconBg)}>
          <Icon className="size-4 md:size-4.5 xl:size-5" />
        </div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <span className={cn("inline-block mt-0.5 px-2 py-0.5 border rounded-full font-bold text-[10px] md:text-[11px] xl:text-xs uppercase tracking-wider", s.badge)}>
            {s.label}
          </span>
        </div>
      </div>

      {/* Items */}
      <ul className="divide-y divide-border">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 px-5 py-3.5">
            <span className={cn("flex-shrink-0 mt-1.5 rounded-full size-1.5", s.bullet)} />
            <div>
              <p className="font-medium text-sm">{item.title}</p>
              {item.description && (
                <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">{item.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
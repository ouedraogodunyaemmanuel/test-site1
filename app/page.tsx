"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// --- Data --------------------------------------------------------------
// With no backend yet, the print collection is hardcoded here.
// It will likely come from an API or a CMS eventually.

type Category = "montagne" | "mer" | "desert" | "foret";

type Print = {
  id: number;
  title: string;
  category: Category;
  price: number;
  image: string;
};

const FILTERS: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "montagne", label: "Montagne" },
  { value: "mer", label: "Mer" },
  { value: "desert", label: "Désert" },
  { value: "foret", label: "Forêt" },
];

// Customizable options offered when buying a print.
const FORMATS: { value: string; label: string }[] = [
  { value: "30x20", label: "30 × 20 cm" },
  { value: "60x40", label: "60 × 40 cm" },
  { value: "90x60", label: "90 × 60 cm" },
];

const FINISHES: { value: string; label: string }[] = [
  { value: "mat", label: "Mat" },
  { value: "brillant", label: "Brillant" },
];

const FRAMES: { value: string; label: string }[] = [
  { value: "aucun", label: "Pas de cadre" },
  { value: "noir", label: "Alu noir" },
  { value: "cuivre", label: "Alu cuivre" },
  { value: "argente", label: "Alu argenté" },
];

// Each `image` points to a file expected in /public/images/tirages/.
// Drop your photos there with exactly these names for them to show up.
const PRINTS: Print[] = [
  {
    id: 1,
    title: "Sommets silencieux",
    category: "montagne",
    price: 320,
    image: "/images/tirages/sommets-silencieux.jpg",
  },
  {
    id: 2,
    title: "Miroir alpin",
    category: "montagne",
    price: 280,
    image: "/images/tirages/miroir-alpin.jpg",
  },
  {
    id: 3,
    title: "Marée du soir",
    category: "mer",
    price: 260,
    image: "/images/tirages/maree-du-soir.jpg",
  },
  {
    id: 4,
    title: "Vallée oubliée",
    category: "montagne",
    price: 340,
    image: "/images/tirages/vallee-oubliee.jpg",
  },
  {
    id: 5,
    title: "Dunes de sable",
    category: "desert",
    price: 300,
    image: "/images/tirages/dunes-de-sable.jpg",
  },
  {
    id: 6,
    title: "Lumière des bois",
    category: "foret",
    price: 250,
    image: "/images/tirages/lumiere-des-bois.jpg",
  },
  {
    id: 7,
    title: "Étendue sauvage",
    category: "foret",
    price: 290,
    image: "/images/tirages/etendue-sauvage.jpg",
  },
  {
    id: 8,
    title: "Aube sur les cimes",
    category: "montagne",
    price: 310,
    image: "/images/tirages/aube-sur-les-cimes.jpg",
  },
];

// --- Page ------------------------------------------------------------------

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">(
    "all"
  );
  const [openPrint, setOpenPrint] = useState<Print | null>(null);

  const displayedPrints =
    activeCategory === "all"
      ? PRINTS
      : PRINTS.filter((print) => print.category === activeCategory);

  return (
    <div className="flex flex-1 flex-col bg-stone-50 font-sans text-stone-900">
      <Header />
      <HeroSection />
      <GallerySection
        filters={FILTERS}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        prints={displayedPrints}
        onOpenPrint={setOpenPrint}
      />
      <AboutSection />
      <Footer />
      {openPrint && (
        <PrintDetailModal
          print={openPrint}
          onClose={() => setOpenPrint(null)}
        />
      )}
    </div>
  );
}

// --- Header -----------------------------------------------------------

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-serif text-xl tracking-[0.2em] text-stone-900">
          DEO CREATION
        </span>
        <nav className="hidden gap-8 text-sm text-stone-600 sm:flex">
          <a href="#gallery" className="transition-colors hover:text-stone-900">
            Collection
          </a>
          <a href="#about" className="transition-colors hover:text-stone-900">
            À propos
          </a>
          <a href="#footer" className="transition-colors hover:text-stone-900">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

// --- Hero ----------------------------------------------------------------

function HeroSection() {
  return (
    <section className="relative flex h-[85vh] min-h-[520px] items-end overflow-hidden">
      {/* Drop your main photo in /public/images/hero.jpg */}
      <Image
        src="/images/hero.jpg"
        alt="Paysage mis en avant"
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay to keep the text readable regardless of the photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24">
        <h1 className="max-w-xl font-serif text-4xl leading-tight text-stone-50 sm:text-5xl">
          Des paysages intemporels, tirés avec exigence.
        </h1>
        <p className="mt-4 max-w-md text-stone-200">
          Éditions limitées, impression fine art sur papier coton.
        </p>
        <a
          href="#gallery"
          className="mt-8 inline-flex items-center gap-2 border border-stone-50 px-6 py-3 text-sm tracking-wide text-stone-50 transition-colors hover:bg-stone-50 hover:text-stone-900"
        >
          Découvrir la collection
        </a>
      </div>
    </section>
  );
}

// --- Gallery ---------------------------------------------------------------

function GallerySection({
  filters,
  activeCategory,
  onCategoryChange,
  prints,
  onOpenPrint,
}: {
  filters: { value: Category | "all"; label: string }[];
  activeCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
  prints: Print[];
  onOpenPrint: (print: Print) => void;
}) {
  return (
    <section id="gallery" className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-serif text-3xl text-stone-900">La collection</h2>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onCategoryChange(filter.value)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                activeCategory === filter.value
                  ? "border-stone-900 bg-stone-900 text-stone-50"
                  : "border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {prints.map((print) => (
          <PrintCard
            key={print.id}
            print={print}
            onOpen={() => onOpenPrint(print)}
          />
        ))}
      </div>
    </section>
  );
}

function PrintCard({
  print,
  onOpen,
}: {
  print: Print;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative aspect-[4/5] overflow-hidden bg-stone-200 text-left"
    >
      <Image
        src={print.image}
        alt={print.title}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {/* Overlay revealed on hover: print title and starting price */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/0 to-black/0 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="font-serif text-lg text-stone-50">{print.title}</span>
        <span className="mt-1 text-sm text-stone-300">
          à partir de {print.price} €
        </span>
      </div>
    </button>
  );
}

// --- About ----------------------------------------------------------

function AboutSection() {
  return (
    <section id="about" className="border-t border-stone-200 bg-stone-100">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <h2 className="font-serif text-3xl text-stone-900">Une exigence de qualité</h2>
        <p className="mt-6 text-stone-600 leading-relaxed">
          Chaque tirage est réalisé en édition limitée sur papier fine art
          100% coton, avec des encres pigmentaires garanties plus de 80 ans
          sans altération. Une manière de faire entrer un paysage chez soi,
          durablement.
        </p>
      </div>
    </section>
  );
}

// --- Footer ------------------------------------------------------

function Footer() {
  return (
    <footer id="footer" className="border-t border-stone-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-stone-500 sm:flex-row sm:justify-between sm:px-10">
        <span className="font-serif tracking-[0.2em] text-stone-700">DEO CREATION</span>
        <span>© {new Date().getFullYear()} Deo Création. Tous droits réservés.</span>
      </div>
    </footer>
  );
}

// --- Detail window (lightbox) ---------------------------------------

// Name of the three customizable option groups, used to know which
// submenu is currently expanded.
type OptionGroupName = "format" | "finish" | "frame";

function PrintDetailModal({
  print,
  onClose,
}: {
  print: Print;
  onClose: () => void;
}) {
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0].value);
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0].value);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0].value);
  const [openGroup, setOpenGroup] = useState<OptionGroupName | null>(null);

  function toggleGroup(name: OptionGroupName) {
    setOpenGroup((current) => (current === name ? null : name));
  }

  // Close the modal with the Escape key, for correct keyboard navigation.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock background scrolling while the modal is open, and restore the
  // previous value on close (fixes the page scrolling behind the modal).
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-10"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-detail-title"
        className="relative flex max-h-full w-full max-w-4xl flex-col overflow-y-auto bg-stone-50 sm:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative aspect-[4/5] w-full shrink-0 sm:w-3/5">
          <Image
            src={print.image}
            alt={print.title}
            fill
            sizes="(min-width: 640px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex w-full flex-col justify-between p-8 sm:w-2/5">
          <div>
            <h3 id="print-detail-title" className="font-serif text-2xl text-stone-900">
              {print.title}
            </h3>
            <p className="mt-6 text-2xl text-stone-900">{print.price} €</p>

            <div className="mt-6">
              <OptionGroup
                title="Format"
                options={FORMATS}
                currentValue={selectedFormat}
                isOpen={openGroup === "format"}
                onToggle={() => toggleGroup("format")}
                onSelect={setSelectedFormat}
              />
              <OptionGroup
                title="Finition"
                options={FINISHES}
                currentValue={selectedFinish}
                isOpen={openGroup === "finish"}
                onToggle={() => toggleGroup("finish")}
                onSelect={setSelectedFinish}
              />
              <OptionGroup
                title="Cadre"
                options={FRAMES}
                currentValue={selectedFrame}
                isOpen={openGroup === "frame"}
                onToggle={() => toggleGroup("frame")}
                onSelect={setSelectedFrame}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              className="bg-stone-900 px-6 py-3 text-sm tracking-wide text-stone-50 transition-colors hover:bg-stone-700"
            >
              Ajouter au panier
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-stone-300 px-6 py-3 text-sm tracking-wide text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// A customizable option group: a button showing the current choice,
// which expands a submenu of possible values on click.
function OptionGroup({
  title,
  options,
  currentValue,
  isOpen,
  onToggle,
  onSelect,
}: {
  title: string;
  options: { value: string; label: string }[];
  currentValue: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  const currentLabel = options.find(
    (option) => option.value === currentValue
  )?.label;

  return (
    <div className="border-b border-stone-200 py-3 first:border-t">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm text-stone-500">{title}</span>
        <span className="flex items-center gap-2 text-sm text-stone-900">
          {currentLabel}
          <span
            className={`text-xs transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            ▾
          </span>
        </span>
      </button>
      {isOpen && (
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(option.value);
                onToggle();
              }}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                option.value === currentValue
                  ? "border-stone-900 bg-stone-900 text-stone-50"
                  : "border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

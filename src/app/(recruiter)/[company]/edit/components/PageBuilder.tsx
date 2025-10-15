"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { ContentSection } from "@/models/Company";
import { SectionEditor } from "./SectionEditor";
import { SectionPreview } from "./SectionPreview";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PageBuilderProps {
  sections: ContentSection[];
  onSectionsChange: (sections: ContentSection[]) => void;
  companySlug: string;
  loading?: boolean;
}

const SECTION_TEMPLATES: Partial<ContentSection>[] = [
  { type: 'hero', title: 'Hero Section', content: 'Welcome to our company' },
  { type: 'text', title: 'About Us', content: 'Tell your company story...' },
  { type: 'image', title: 'Image Section', imageUrl: '' },
  { type: 'video', title: 'Culture Video', videoUrl: '' },
  { type: 'values', title: 'Our Values', data: { values: [] } },
  { type: 'locations', title: 'Where We Work', data: { locations: [] } },
  { type: 'perks', title: 'Benefits & Perks', data: { perks: [] } },
  { type: 'testimonial', title: 'Employee Testimonial', content: 'Great place to work!' },
  { type: 'cta', title: 'Call to Action', content: 'Ready to join us?' },
];

function SortableItem({
  id,
  selected,
  onClick,
  children,
  right,
}: {
  id: string;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} onClick={onClick} className={`group`}>
      <div className={`flex items-center justify-between rounded-md border bg-white p-3 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex items-center gap-2">
          <button aria-label="Drag" className="cursor-grab p-1 text-muted-foreground hover:text-foreground" {...attributes} {...listeners}>
            <GripVertical className="h-4 w-4" />
          </button>
          {children}
        </div>
        <div className="ml-auto">{right}</div>
      </div>
    </div>
  );
}

export function PageBuilder({ sections, onSectionsChange, loading }: PageBuilderProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      onSectionsChange(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const addSection = (template: Partial<ContentSection>) => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      type: template.type!,
      title: template.title || '',
      content: template.content || '',
      imageUrl: template.imageUrl || '',
      videoUrl: template.videoUrl || '',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      alignment: 'left',
      size: 'medium',
      data: template.data || {},
    };
    onSectionsChange([...sections, newSection]);
    setSelectedSection(newSection.id);
  };

  const updateSection = (id: string, updates: Partial<ContentSection>) => {
    onSectionsChange(
      sections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      )
    );
  };

  const deleteSection = (id: string) => {
    onSectionsChange(sections.filter((s) => s.id !== id));
    if (selectedSection === id) setSelectedSection(null);
  };

  return (
    <div className="grid h-full grid-cols-12 gap-4">
      {/* Section Templates Sidebar */}
      <div className="col-span-2 space-y-2 mt-2">
        <h3 className="text-sm font-medium">Add Sections</h3>
        {SECTION_TEMPLATES.map((template, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => addSection(template)}
          >
            <Plus className="mr-1 h-3 w-3" />
            {template.title}
          </Button>
        ))}
      </div>

      {/* Main Builder Area */}
      <div className="col-span-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium">Page Structure</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : previewMode ? (
          <div className="space-y-4">
            {sections.map((section) => (
              <SectionPreview key={section.id} section={section} />
            ))}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 w-full">
                {sections.map((section) => (
                  <SortableItem
                    key={section.id}
                    id={section.id}
                    selected={selectedSection === section.id}
                    onClick={() => setSelectedSection(section.id)}
                    right={
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                      >
                        X
                      </Button>
                    }
                  >
                    <div>
                      <div className="font-medium text-sm">{section.title || section.type}</div>
                      <div className="text-xs text-muted-foreground">{section.type}</div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Section Editor Sidebar */}
      <div className="col-span-4">
        {!loading && selectedSection && (
          <SectionEditor
            section={sections.find((s) => s.id === selectedSection)!}
            onUpdate={(updates) => updateSection(selectedSection, updates)}
          />
        )}
        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
      </div>
    </div>
  );
}

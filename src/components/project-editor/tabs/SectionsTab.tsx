"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CustomSectionContent, SectionType, ThemeParams, ThemeSectionOrderItem } from "@/types";
import {
  createSectionId,
  DEFAULT_BODY_SECTION_ORDER,
  getSectionDefinition,
  isCoreSection,
  SECTION_LIBRARY,
} from "@/components/themes/vietnam-coffee/sections/library/registry";

interface SectionsTabProps {
  themeParams: ThemeParams;
  updateThemeParam: (path: string[], value: string | number | unknown) => void;
}

type EditableItem = NonNullable<CustomSectionContent["items"]>[number];
type EditableFaq = NonNullable<CustomSectionContent["faqs"]>[number];

const coreLabels: Record<string, string> = {
  hero: "Hero",
  problemSolution: "Problem / Solution",
  leadMagnet: "Lead Magnet",
  products: "Products",
  whyChooseUs: "Why Choose Us",
  testimonials: "Testimonials",
};

function cloneSectionContent(content: CustomSectionContent): CustomSectionContent {
  return JSON.parse(JSON.stringify(content));
}

export default function SectionsTab({ themeParams, updateThemeParam }: SectionsTabProps) {
  const content = themeParams.content || {};
  const sectionOrder = useMemo<ThemeSectionOrderItem[]>(() => {
    return Array.isArray(content.sectionOrder) && content.sectionOrder.length > 0
      ? content.sectionOrder
      : DEFAULT_BODY_SECTION_ORDER;
  }, [content.sectionOrder]);

  const customSections = content.customSections || {};
  const [selectedSectionId, setSelectedSectionId] = useState(sectionOrder[0]?.id || "");
  const selectedSection = sectionOrder.find((section) => section.id === selectedSectionId) || sectionOrder[0];
  const selectedCustomContent = selectedSection ? customSections[selectedSection.id] : undefined;

  const commitSections = (
    nextOrder: ThemeSectionOrderItem[],
    nextCustomSections: Record<string, CustomSectionContent> = customSections
  ) => {
    updateThemeParam(["content"], {
      ...content,
      sectionOrder: nextOrder,
      customSections: nextCustomSections,
    });
  };

  const updateCustomSection = (sectionId: string, nextSectionContent: CustomSectionContent) => {
    commitSections(sectionOrder, {
      ...customSections,
      [sectionId]: nextSectionContent,
    });
  };

  const addSection = (type: SectionType) => {
    const definition = getSectionDefinition(type);
    if (!definition) return;

    const id = createSectionId(type);
    const nextSection: ThemeSectionOrderItem = { id, type, enabled: true };
    const nextCustomSections = {
      ...customSections,
      [id]: cloneSectionContent(definition.defaultContent),
    };

    commitSections([...sectionOrder, nextSection], nextCustomSections);
    setSelectedSectionId(id);
  };

  const toggleSection = (sectionId: string) => {
    commitSections(sectionOrder.map((section) => (
      section.id === sectionId ? { ...section, enabled: !section.enabled } : section
    )));
  };

  const moveSection = (sectionId: string, direction: -1 | 1) => {
    const index = sectionOrder.findIndex((section) => section.id === sectionId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= sectionOrder.length) return;

    const nextOrder = [...sectionOrder];
    const [section] = nextOrder.splice(index, 1);
    nextOrder.splice(nextIndex, 0, section);
    commitSections(nextOrder);
  };

  const deleteSection = (sectionId: string) => {
    const section = sectionOrder.find((item) => item.id === sectionId);
    if (!section || section.core || isCoreSection(section.type)) return;

    const nextOrder = sectionOrder.filter((item) => item.id !== sectionId);
    const nextCustomSections = { ...customSections };
    delete nextCustomSections[sectionId];
    commitSections(nextOrder, nextCustomSections);
    setSelectedSectionId(nextOrder[0]?.id || "");
  };

  const updateField = (field: keyof CustomSectionContent, value: string) => {
    if (!selectedSection) return;
    updateCustomSection(selectedSection.id, {
      ...(selectedCustomContent || {}),
      type: selectedSection.type,
      [field]: value,
    });
  };

  const updateItem = (index: number, field: keyof EditableItem, value: string) => {
    if (!selectedSection) return;
    const items = [...(selectedCustomContent?.items || [])];
    items[index] = { ...items[index], [field]: value };
    updateCustomSection(selectedSection.id, {
      ...(selectedCustomContent || {}),
      type: selectedSection.type,
      items,
    });
  };

  const addItem = () => {
    if (!selectedSection) return;
    const items = [
      ...(selectedCustomContent?.items || []),
      { id: `item-${Date.now()}`, title: "New item", description: "Describe this item." },
    ];
    updateCustomSection(selectedSection.id, {
      ...(selectedCustomContent || {}),
      type: selectedSection.type,
      items,
    });
  };

  const removeItem = (index: number) => {
    if (!selectedSection) return;
    updateCustomSection(selectedSection.id, {
      ...(selectedCustomContent || {}),
      type: selectedSection.type,
      items: (selectedCustomContent?.items || []).filter((_, itemIndex) => itemIndex !== index),
    });
  };

  const updateFaq = (index: number, field: keyof EditableFaq, value: string) => {
    if (!selectedSection) return;
    const faqs = [...(selectedCustomContent?.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: value };
    updateCustomSection(selectedSection.id, {
      ...(selectedCustomContent || {}),
      type: selectedSection.type,
      faqs,
    });
  };

  const addFaq = () => {
    if (!selectedSection) return;
    updateCustomSection(selectedSection.id, {
      ...(selectedCustomContent || {}),
      type: selectedSection.type,
      faqs: [
        ...(selectedCustomContent?.faqs || []),
        { id: `faq-${Date.now()}`, question: "New question", answer: "Answer this question." },
      ],
    });
  };

  const removeFaq = (index: number) => {
    if (!selectedSection) return;
    updateCustomSection(selectedSection.id, {
      ...(selectedCustomContent || {}),
      type: selectedSection.type,
      faqs: (selectedCustomContent?.faqs || []).filter((_, faqIndex) => faqIndex !== index),
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Add section</h3>
        <div className="grid gap-3">
          {SECTION_LIBRARY.map((section) => (
            <div key={section.type} className="flex items-center justify-between gap-3 rounded-md border p-3">
              <div>
                <div className="font-medium">{section.label}</div>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <Button size="sm" onClick={() => addSection(section.type)}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Page sections</h3>
        <div className="space-y-2">
          {sectionOrder.map((section, index) => {
            const definition = getSectionDefinition(section.type);
            const label = definition?.label || coreLabels[section.type] || section.type;
            const selected = selectedSection?.id === section.id;

            return (
              <div
                key={section.id}
                className={`rounded-md border p-3 ${selected ? "border-gray-900 bg-gray-50" : "border-gray-200"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <button className="min-w-0 flex-1 text-left" onClick={() => setSelectedSectionId(section.id)}>
                    <div className="truncate font-medium">{label}</div>
                    <div className="text-xs text-gray-500">{section.core || isCoreSection(section.type) ? "Core section" : section.id}</div>
                  </button>
                  <Button size="icon" variant="outline" onClick={() => toggleSection(section.id)} title={section.enabled ? "Hide" : "Show"}>
                    {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => moveSection(section.id, -1)} disabled={index === 0} title="Move up">
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => moveSection(section.id, 1)} disabled={index === sectionOrder.length - 1} title="Move down">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => deleteSection(section.id)}
                    disabled={section.core || isCoreSection(section.type)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {selectedSection && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Edit selected section</h3>
          {isCoreSection(selectedSection.type) ? (
            <p className="text-sm text-gray-500">
              Core section content is edited in its own tab. Use this panel to hide/show or reorder it.
            </p>
          ) : (
            <div className="space-y-4">
              {(selectedSection.type === "proof" || selectedSection.type === "finalCta") && (
                <div>
                  <Label>Variant</Label>
                  <Select
                    value={selectedCustomContent?.variant || (selectedSection.type === "proof" ? "caseStudyWithGallery" : "formRight")}
                    onValueChange={(value) => updateField("variant", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedSection.type === "proof" ? (
                        <>
                          <SelectItem value="caseStudyWithGallery">Case study with gallery</SelectItem>
                          <SelectItem value="galleryFirst">Gallery first</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="formRight">Form right</SelectItem>
                          <SelectItem value="centeredForm">Centered CTA</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Badge</Label>
                <Input value={selectedCustomContent?.badge || ""} onChange={(event) => updateField("badge", event.target.value)} />
              </div>
              <div>
                <Label>Title</Label>
                <Input value={selectedCustomContent?.title || ""} onChange={(event) => updateField("title", event.target.value)} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={selectedCustomContent?.description || ""} onChange={(event) => updateField("description", event.target.value)} rows={3} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Background color</Label>
                  <Input value={selectedCustomContent?.backgroundColor || ""} onChange={(event) => updateField("backgroundColor", event.target.value)} placeholder="#FFFFFF" />
                </div>
                <div>
                  <Label>Text color</Label>
                  <Input value={selectedCustomContent?.textColor || ""} onChange={(event) => updateField("textColor", event.target.value)} placeholder="#2D3748" />
                </div>
              </div>

              {selectedSection.type === "finalCta" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Primary button</Label>
                    <Input value={selectedCustomContent?.buttonText || ""} onChange={(event) => updateField("buttonText", event.target.value)} />
                  </div>
                  <div>
                    <Label>Secondary button</Label>
                    <Input value={selectedCustomContent?.secondaryButtonText || ""} onChange={(event) => updateField("secondaryButtonText", event.target.value)} />
                  </div>
                </div>
              )}

              {selectedSection.type === "faq" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Questions</h4>
                    <Button size="sm" variant="outline" onClick={addFaq}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add question
                    </Button>
                  </div>
                  {(selectedCustomContent?.faqs || []).map((faq, index) => (
                    <div key={faq.id || index} className="space-y-3 rounded-md border p-3">
                      <Input value={faq.question || ""} onChange={(event) => updateFaq(index, "question", event.target.value)} placeholder="Question" />
                      <Textarea value={faq.answer || ""} onChange={(event) => updateFaq(index, "answer", event.target.value)} placeholder="Answer" rows={2} />
                      <Button size="sm" variant="outline" onClick={() => removeFaq(index)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Items</h4>
                    <Button size="sm" variant="outline" onClick={addItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add item
                    </Button>
                  </div>
                  {(selectedCustomContent?.items || []).map((item, index) => (
                    <div key={item.id || index} className="space-y-3 rounded-md border p-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input value={item.title || ""} onChange={(event) => updateItem(index, "title", event.target.value)} placeholder="Title" />
                        <Input value={item.icon || ""} onChange={(event) => updateItem(index, "icon", event.target.value)} placeholder="Icon" />
                        <Input value={item.value || ""} onChange={(event) => updateItem(index, "value", event.target.value)} placeholder="Value / number" />
                        <Input value={item.label || ""} onChange={(event) => updateItem(index, "label", event.target.value)} placeholder="Label" />
                      </div>
                      <Textarea value={item.description || ""} onChange={(event) => updateItem(index, "description", event.target.value)} placeholder="Description" rows={2} />
                      <Input value={item.image || ""} onChange={(event) => updateItem(index, "image", event.target.value)} placeholder="Image URL" />
                      <Button size="sm" variant="outline" onClick={() => removeItem(index)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

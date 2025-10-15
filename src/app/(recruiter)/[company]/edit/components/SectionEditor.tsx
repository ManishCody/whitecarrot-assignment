"use client";

import { ContentSection } from "@/models/Company";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HexColorPicker } from "react-colorful";
import { useEffect, useState } from "react";

interface SectionEditorProps {
  section: ContentSection;
  onUpdate: (updates: Partial<ContentSection>) => void;
}

export function SectionEditor({ section, onUpdate }: SectionEditorProps) {
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);

  const [valuesJson, setValuesJson] = useState<string>(
    JSON.stringify(section.data?.values || [], null, 2)
  );
  const [locationsJson, setLocationsJson] = useState<string>(
    JSON.stringify(section.data?.locations || [], null, 2)
  );
  const [perksJson, setPerksJson] = useState<string>(
    JSON.stringify(section.data?.perks || [], null, 2)
  );
  const [jsonError, setJsonError] = useState<string>("");

  useEffect(() => {
    setValuesJson(JSON.stringify(section.data?.values || [], null, 2));
    setLocationsJson(JSON.stringify(section.data?.locations || [], null, 2));
    setPerksJson(JSON.stringify(section.data?.perks || [], null, 2));
    setJsonError("");
  }, [section.id, section.data?.values, section.data?.locations, section.data?.perks]);

  const renderTypeSpecificFields = () => {
    switch (section.type) {
      case 'hero':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Image</label>
              <Input
                value={section.imageUrl || ''}
                onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL</label>
              <Input
                value={section.videoUrl || ''}
                onChange={(e) => onUpdate({ videoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </>
        );
      
      case 'image':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              value={section.imageUrl || ''}
              onChange={(e) => onUpdate({ imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Video URL</label>
            <Input
              value={section.videoUrl || ''}
              onChange={(e) => onUpdate({ videoUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        );
      
      case 'values':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Values (JSON)</label>
            <Textarea
              value={valuesJson}
              onChange={(e) => {
                setValuesJson(e.target.value);
              }}
              onBlur={() => {
                try {
                  const values = JSON.parse(valuesJson);
                  onUpdate({ data: { ...section.data, values } });
                  setJsonError("");
                } catch {
                  setJsonError("Invalid JSON in Values");
                }
              }}
              placeholder='[{"title": "Innovation", "description": "We innovate"}]'
              rows={4}
            />
            {jsonError && <p className="text-xs text-red-600">{jsonError}</p>}
          </div>
        );
      
      case 'locations':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Locations (JSON)</label>
            <Textarea
              value={locationsJson}
              onChange={(e) => {
                setLocationsJson(e.target.value);
              }}
              onBlur={() => {
                try {
                  const locations = JSON.parse(locationsJson);
                  onUpdate({ data: { ...section.data, locations } });
                  setJsonError("");
                } catch {
                  setJsonError("Invalid JSON in Locations");
                }
              }}
              placeholder='[{"city": "Boston", "address": "123 Main St"}]'
              rows={4}
            />
            {jsonError && <p className="text-xs text-red-600">{jsonError}</p>}
          </div>
        );
      
      case 'perks':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Perks (JSON)</label>
            <Textarea
              value={perksJson}
              onChange={(e) => {
                setPerksJson(e.target.value);
              }}
              onBlur={() => {
                try {
                  const perks = JSON.parse(perksJson);
                  onUpdate({ data: { ...section.data, perks } });
                  setJsonError("");
                } catch {
                  setJsonError("Invalid JSON in Perks");
                }
              }}
              placeholder='[{"title": "Health Insurance", "description": "Full coverage"}]'
              rows={4}
            />
            {jsonError && <p className="text-xs text-red-600">{jsonError}</p>}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Edit {section.type} Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Fields */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={section.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Section title"
          />
        </div>

        {section.type !== 'image' && section.type !== 'video' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={section.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Section content"
              rows={3}
            />
          </div>
        )}

        {/* Type-specific fields */}
        {renderTypeSpecificFields()}

        {/* Styling Options */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Alignment</label>
          <Select value={section.alignment} onValueChange={(value) => onUpdate({ alignment: value as 'left' | 'center' | 'right' })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Size</label>
          <Select value={section.size} onValueChange={(value) => onUpdate({ size: value as 'small' | 'medium' | 'large' })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Pickers */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Background Color</label>
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded border cursor-pointer"
              style={{ backgroundColor: section.backgroundColor }}
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
            />
            <Input
              value={section.backgroundColor || '#ffffff'}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              placeholder="#ffffff"
            />
          </div>
          {showBgColorPicker && (
            <div className="absolute z-10">
              <HexColorPicker
                color={section.backgroundColor}
                onChange={(color) => onUpdate({ backgroundColor: color })}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Text Color</label>
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded border cursor-pointer"
              style={{ backgroundColor: section.textColor }}
              onClick={() => setShowTextColorPicker(!showTextColorPicker)}
            />
            <Input
              value={section.textColor || '#000000'}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              placeholder="#000000"
            />
          </div>
          {showTextColorPicker && (
            <div className="absolute z-10">
              <HexColorPicker
                color={section.textColor}
                onChange={(color) => onUpdate({ textColor: color })}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

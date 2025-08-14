"use client";

import React, { useState, useEffect, FormEvent } from "react";
import getHomepageSections from "@/actions/getHomepageSections";
import {
  createHomepageSection,
  updateHomepageSection,
  deleteHomepageSection,
} from "@/actions/homepageSections";
import { HomepageSection } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Pencil, Trash } from "lucide-react";

const PagesContentEditorPage = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<HomepageSection | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    cta_text: "",
    cta_url: "",
    order: 0,
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setIsLoading(true);
        const sectionsData = await getHomepageSections();
        setSections(sectionsData);
      } catch (err) {
        setError("Failed to fetch homepage sections.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleOpenModal = (section: HomepageSection | null = null) => {
    setCurrentSection(section);
    if (section) {
      setFormData({
        title: section.title,
        content: section.content || "",
        image_url: section.image_url || "",
        cta_text: section.cta_text || "",
        cta_url: section.cta_url || "",
        order: section.order,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        image_url: "",
        cta_text: "",
        cta_url: "",
        order: sections.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSection(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (currentSection) {
        await updateHomepageSection(currentSection.id, formData);
      } else {
        await createHomepageSection(formData);
      }
      const sectionsData = await getHomepageSections();
      setSections(sectionsData);
      handleCloseModal();
    } catch (err) {
      setError(
        `Failed to ${currentSection ? "update" : "create"} section.`
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      try {
        await deleteHomepageSection(id);
        const sectionsData = await getHomepageSections();
        setSections(sectionsData);
      } catch (err) {
        setError("Failed to delete section.");
      }
    }
  };

  if (isLoading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pages Content Editor</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Section
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>{section.order}</TableCell>
                  <TableCell>{section.title}</TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleOpenModal(section)}
                      className="text-primary p-1 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentSection ? "Edit Section" : "Add New Section"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (JSON)</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Content (JSON)"
                value={formData.content}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_text">CTA Text</Label>
              <Input
                id="cta_text"
                name="cta_text"
                placeholder="CTA Text"
                value={formData.cta_text}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_url">CTA URL</Label>
              <Input
                id="cta_url"
                name="cta_url"
                placeholder="CTA URL"
                value={formData.cta_url}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                placeholder="Order"
                value={formData.order}
                onChange={handleChange}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {currentSection ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PagesContentEditorPage;

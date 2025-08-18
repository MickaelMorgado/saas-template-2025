"use client";

import {
  createPageSection,
  deletePageSection,
  getPageSections,
  updatePageSection,
} from "@/actions/cms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TiptapEditor from "@/components/ui/TiptapEditor";
import { Pencil, PlusCircle, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface PageSection {
  id: string;
  title: string;
  content: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  order: number;
}

const PageSectionsDashboard = () => {
  const { pageId } = useParams();
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<PageSection | null>(
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
    fetchSections();
  }, [pageId]);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const sectionsData = await getPageSections(pageId as string);
      setSections(sectionsData);
    } catch (err) {
      setError("Failed to fetch page sections.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (section: PageSection | null = null) => {
    setCurrentSection(section);
    if (section) {
      setFormData(section);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value, 10) : value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (currentSection) {
        await updatePageSection(currentSection.id, formData.title, formData.content, formData.image_url, formData.cta_text, formData.cta_url, formData.order);
      } else {
        await createPageSection(pageId as string, formData.title, formData.content, formData.image_url, formData.cta_text, formData.cta_url, formData.order);
      }
      fetchSections();
      handleCloseModal();
    } catch (err) {
      setError(`Failed to ${currentSection ? "update" : "create"} section.`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      try {
        await deletePageSection(id);
        fetchSections();
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
        <h1 className="text-3xl font-bold">Edit Page Sections</h1>
        <Button onClick={() => handleOpenModal()}>
          <PlusCircle className="mr-2 h-5 w-5" />
          New Section
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Sections</CardTitle>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenModal(section)}
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(section.id)}
                      className="text-destructive"
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
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
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <TiptapEditor
                content={formData.content}
                onChange={handleContentChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_text">CTA Text</Label>
              <Input
                id="cta_text"
                name="cta_text"
                value={formData.cta_text}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_url">CTA URL</Label>
              <Input
                id="cta_url"
                name="cta_url"
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

export default PageSectionsDashboard;

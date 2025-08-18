"use client";

import {
  createPage,
  deletePage,
  getPages,
  updatePage,
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, EyeOff, Pencil, PlusCircle, Trash } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

// Define types for Page and Section
interface Page {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
}

const PagesDashboard = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    is_published: false,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const pagesData = await getPages();
      setPages(pagesData);
    } catch (err) {
      setError("Failed to fetch pages.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (page: Page | null = null) => {
    setCurrentPage(page);
    if (page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        is_published: page.is_published,
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        is_published: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handlePublishChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_published: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (currentPage) {
        await updatePage(
          currentPage.id,
          formData.title,
          formData.slug,
          formData.is_published
        );
      } else {
        await createPage(formData.title, formData.slug);
      }
      fetchPages();
      handleCloseModal();
    } catch (err) {
      setError(`Failed to ${currentPage ? "update" : "create"} page.`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      try {
        await deletePage(id);
        fetchPages();
      } catch (err) {
        setError("Failed to delete page.");
      }
    }
  };

  if (isLoading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Button onClick={() => handleOpenModal()}>
          <PlusCircle className="mr-2 h-5 w-5" />
          New Page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>{page.title}</TableCell>
                  <TableCell>/{page.slug}</TableCell>
                  <TableCell>
                    {page.is_published ? (
                      <span className="flex items-center text-green-500">
                        <Eye className="mr-2 h-4 w-4" /> Published
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500">
                        <EyeOff className="mr-2 h-4 w-4" /> Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/pages/${page.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenModal(page)}
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(page.id)}
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
            <DialogTitle>{currentPage ? "Edit Page" : "Add New Page"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Page Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="page-slug"
                value={formData.slug}
                onChange={handleSlugChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={handlePublishChange}
              />
              <Label htmlFor="is_published">Publish</Label>
            </div>
            <DialogFooter>
              <Button type="submit">
                {currentPage ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PagesDashboard;

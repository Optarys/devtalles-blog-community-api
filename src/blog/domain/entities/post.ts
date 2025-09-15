import { AggregateRoot } from "../primitives/aggregate-root";
import { Slug } from "../value-objects/slug";
import { Category } from "./category";
import { Tag } from "./tag";
import { CommentEntity } from "@core/persistence/models";
import { PostCreatedDomainEvent } from "../events/post-created.event";
import { PostPublishedDomainEvent } from "../events/post-published.event";
import { PostCommentedDomainEvent } from "../events/post-commented.event";

export class Post extends AggregateRoot {

  private id: number;
  private title: string;
  private slug: Slug;
  private content: string;
  private summary: string;
  private authorId: string;
  private status: string;
  private publishedAt?: Date;
  private category: Category;
  private tags: Tag[] = [];
  private comments: CommentEntity[] = [];
  private seoMeta?: Record<string, any>;
  private bannerImages: string[] = [];

  private constructor(
    title: string,
    slug: Slug,
    content: string,
    summary: string,
    authorId: string,
    category: Category,
    status: string,
    tags: Tag[] = [],
    comments: CommentEntity[] = [],
    seoMeta?: Record<string, any>,
    publishedAt?: Date,
    bannerImages: string[] = []
  ) {
    super();
    this.title = title;
    this.slug = slug;
    this.content = content;
    this.summary = summary;
    this.authorId = authorId;
    this.publishedAt = publishedAt;
    this.status = status;
    this.category = category;
    this.tags = tags;
    this.comments = comments;
    this.seoMeta = seoMeta;
    this.bannerImages = bannerImages;
  }

  // Fábrica para crear un nuevo Post
  static createNew(title: string, summary: string, content: string, authorId: string, category: string, status: string = 'draft'): Post {
    const slug = Slug.create(title);
    const post = new Post(title, slug, content, summary, authorId, new Category(category), status);

    if (status === 'published') {
      post.publish(new Date());
    }
    // Publicar evento de dominio al crear
    // post.addDomainEvent(new PostCreatedDomainEvent(id, title, authorId));

    return post;
  }

  // Método de negocio para publicar
  publish(date: Date) {
    if (this.publishedAt) {
      throw new Error("Post ya fue publicado");
    }
    this.publishedAt = date;

    // Publicar evento de dominio al publicar
    this.addDomainEvent(new PostPublishedDomainEvent(this.id, date));
  }

  setId(id: number) {
    this.id = id;
    return this;
  }

  // Métodos de negocio para modificar tags y comments
  addTags(tags: Tag[]) {
    tags.forEach(tag => {
      // Evitar duplicados por slug
      if (!this.tags.find(t => t.getSlug() === tag.getSlug())) {
        this.tags.push(tag);
      }
    });
    return this;
  }

  addSeoMeta(seo?: Record<string, any>) {
    if (seo) {
      this.seoMeta = seo;
    }

    return this;
  }

  addComment(comment: CommentEntity) {
    this.comments.push(comment);
    this.addDomainEvent(new PostCommentedDomainEvent(this.id, comment));
    return this;
  }

  // Getters defensivos
  getId(): number {
    return this.id;
  }

  getStatus(): string {
    return this.status;
  }
  getTitle(): string {
    return this.title;
  }

  getSlug(): string {
    return this.slug.getValue();
  }

  getContent(): string {
    return this.content;
  }

  getSummary(): string {
    return this.summary;
  }

  getAuthorId(): string {
    return this.authorId;
  }

  getPublishedAt(): Date | undefined {
    return this.publishedAt;
  }

  getCategory(): Category {
    return this.category;
  }

  getTags(): Tag[] {
    return [...this.tags]; // copia defensiva
  }

  getComments(): CommentEntity[] {
    return [...this.comments]; // copia defensiva
  }

  getSeoMeta(): Record<string, any> | undefined {
    return this.seoMeta;
  }

  getBannerImages(): string[] {
    return [...this.bannerImages]; // copia defensiva
  }

  addBannerImage(url: string) {
    if (!this.bannerImages.includes(url)) {
      this.bannerImages.push(url);
    }
  }

  updateTitle(newTitle: string) {
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error("El título no puede estar vacío");
    }

    this.title = newTitle;
    this.slug = Slug.create(newTitle); // actualizamos slug
    return this;
  }

  updateContent(newContent: string) {
    if (!newContent || newContent.trim().length === 0) {
      throw new Error("El contenido no puede estar vacío");
    }

    this.content = newContent;
    return this;
  }

  updateCategory(category: Category) {
    this.category = category;
    return this;
  }

  updateSeoMeta(seoMeta: Record<string, any>) {
    this.seoMeta = seoMeta;
    return this;
  }
}
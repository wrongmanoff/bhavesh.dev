export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      life_feed: {
        Row: {
          id: string;
          title: string;
          content: string;
          type: "log" | "review" | "thought" | "productive" | "wasted";
          mood: string;
          tags: string[];
          images: string[];
          created_at: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          title?: string;
          content?: string;
          type?: "log" | "review" | "thought" | "productive" | "wasted";
          mood?: string;
          tags?: string[];
          images?: string[];
          created_at?: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          type?: "log" | "review" | "thought" | "productive" | "wasted";
          mood?: string;
          tags?: string[];
          images?: string[];
          created_at?: string;
          published?: boolean;
        };
        Relationships: [];
      };
      cyber_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content_md: string;
          category: "ctf" | "writeup" | "lab" | "notes" | "tool" | "blog";
          tags: string[];
          difficulty: "beginner" | "easy" | "medium" | "hard" | "insane";
          platform: string;
          images: string[];
          created_at: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          title?: string;
          slug?: string;
          content_md?: string;
          category?: "ctf" | "writeup" | "lab" | "notes" | "tool" | "blog";
          tags?: string[];
          difficulty?: "beginner" | "easy" | "medium" | "hard" | "insane";
          platform?: string;
          images?: string[];
          created_at?: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content_md?: string;
          category?: "ctf" | "writeup" | "lab" | "notes" | "tool" | "blog";
          tags?: string[];
          difficulty?: "beginner" | "easy" | "medium" | "hard" | "insane";
          platform?: string;
          images?: string[];
          created_at?: string;
          published?: boolean;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          why_built: string;
          problem_faced: string;
          lessons_learned: string;
          future_plans: string;
          tech_stack: string[];
          screenshots: string[];
          architecture_img: string;
          github_url: string;
          live_url: string;
          status: "active" | "archived" | "wip";
          created_at: string;
        };
        Insert: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          why_built?: string;
          problem_faced?: string;
          lessons_learned?: string;
          future_plans?: string;
          tech_stack?: string[];
          screenshots?: string[];
          architecture_img?: string;
          github_url?: string;
          live_url?: string;
          status?: "active" | "archived" | "wip";
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          why_built?: string;
          problem_faced?: string;
          lessons_learned?: string;
          future_plans?: string;
          tech_stack?: string[];
          screenshots?: string[];
          architecture_img?: string;
          github_url?: string;
          live_url?: string;
          status?: "active" | "archived" | "wip";
          created_at?: string;
        };
        Relationships: [];
      };
      now_page: {
        Row: {
          id: string;
          current_focus: string;
          current_goals: string[];
          books: string[];
          obsessions: string[];
          current_projects: string[];
          learning_roadmap: Json;
          last_updated: string;
        };
        Insert: {
          id?: string;
          current_focus?: string;
          current_goals?: string[];
          books?: string[];
          obsessions?: string[];
          current_projects?: string[];
          learning_roadmap?: Json;
          last_updated?: string;
        };
        Update: {
          id?: string;
          current_focus?: string;
          current_goals?: string[];
          books?: string[];
          obsessions?: string[];
          current_projects?: string[];
          learning_roadmap?: Json;
          last_updated?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          title: string;
          category: "food" | "cafe" | "product" | "place" | "movie" | "book";
          rating: number;
          content: string;
          images: string[];
          location: string;
          price_range: string;
          created_at: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          title?: string;
          category?: "food" | "cafe" | "product" | "place" | "movie" | "book";
          rating?: number;
          content?: string;
          images?: string[];
          location?: string;
          price_range?: string;
          created_at?: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          category?: "food" | "cafe" | "product" | "place" | "movie" | "book";
          rating?: number;
          content?: string;
          images?: string[];
          location?: string;
          price_range?: string;
          created_at?: string;
          published?: boolean;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          type: "cert" | "internship" | "hackathon" | "club" | "ranking" | "badge" | "streak";
          issuer: string;
          date: string | null;
          description: string;
          image_url: string;
          credential_url: string;
          featured: boolean;
        };
        Insert: {
          id?: string;
          title?: string;
          type?: "cert" | "internship" | "hackathon" | "club" | "ranking" | "badge" | "streak";
          issuer?: string;
          date?: string | null;
          description?: string;
          image_url?: string;
          credential_url?: string;
          featured?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          type?: "cert" | "internship" | "hackathon" | "club" | "ranking" | "badge" | "streak";
          issuer?: string;
          date?: string | null;
          description?: string;
          image_url?: string;
          credential_url?: string;
          featured?: boolean;
        };
        Relationships: [];
      };
      gallery: {
        Row: {
          id: string;
          title: string;
          caption: string;
          image_url: string;
          category: "screenshot" | "setup" | "travel" | "cert" | "coding" | "event";
          taken_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title?: string;
          caption?: string;
          image_url?: string;
          category?: "screenshot" | "setup" | "travel" | "cert" | "coding" | "event";
          taken_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          caption?: string;
          image_url?: string;
          category?: "screenshot" | "setup" | "travel" | "cert" | "coding" | "event";
          taken_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      links: {
        Row: {
          id: string;
          label: string;
          url: string;
          icon: string;
          category: "social" | "hacking" | "dev" | "contact";
          display_order: number;
        };
        Insert: {
          id?: string;
          label?: string;
          url?: string;
          icon?: string;
          category?: "social" | "hacking" | "dev" | "contact";
          display_order?: number;
        };
        Update: {
          id?: string;
          label?: string;
          url?: string;
          icon?: string;
          category?: "social" | "hacking" | "dev" | "contact";
          display_order?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

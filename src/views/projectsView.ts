import * as vscode from 'vscode';
import { ClaudeClient, type Organization, type Project } from '../claude/client';
import type { ClaudeSyncConfig } from '../types';

export class ClaudeProjectsProvider implements vscode.TreeDataProvider<TreeNode> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeNode | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private client: ClaudeClient;
  private cache: { orgs: Organization[]; projects: Map<string, Project[]> } = {
    orgs: [],
    projects: new Map(),
  };

  constructor(private config: ClaudeSyncConfig) {
    this.client = new ClaudeClient(config);
  }

  public updateConfig(config: ClaudeSyncConfig) {
    this.config = config;
    this.client = new ClaudeClient(config);
  }

  refresh(): void {
    this.cache = { orgs: [], projects: new Map() };
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeNode): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TreeNode): Promise<TreeNode[]> {
    if (!this.config.sessionToken) {
      return [
        new vscode.TreeItem(
          'Set your Claude session token to load organizations',
          vscode.TreeItemCollapsibleState.None,
        ),
      ];
    }

    if (!element) {
      // Root: organizations
      if (this.cache.orgs.length === 0) {
        try {
          this.cache.orgs = await this.client.getOrganizations();
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return [new vscode.TreeItem(`Failed to load orgs: ${msg}`, vscode.TreeItemCollapsibleState.None)];
        }
      }
      return this.cache.orgs.map((org) => new OrgNode(org));
    }

    if (element instanceof OrgNode) {
      // Children: projects under org
      const orgId = element.org.id;
      if (!this.cache.projects.has(orgId)) {
        try {
          const projs = await this.client.getProjects(orgId);
          this.cache.projects.set(orgId, projs);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return [new vscode.TreeItem(`Failed to load projects: ${msg}`, vscode.TreeItemCollapsibleState.None)];
        }
      }
      const projects = this.cache.projects.get(orgId) || [];
      return projects.map((p) => new ProjectNode(element.org, p));
    }

    return [];
  }
}

export type TreeNode = OrgNode | ProjectNode;

class OrgNode extends vscode.TreeItem {
  constructor(public readonly org: Organization) {
    super(org.name, vscode.TreeItemCollapsibleState.Collapsed);
    this.contextValue = 'claudesync.org';
    this.iconPath = new vscode.ThemeIcon('organization');
  }
}

class ProjectNode extends vscode.TreeItem {
  constructor(public readonly org: Organization, public readonly project: Project) {
    super(project.name, vscode.TreeItemCollapsibleState.None);
    this.contextValue = 'claudesync.project';
    this.description = project.archived_at ? 'archived' : undefined;
    this.iconPath = project.archived_at ? new vscode.ThemeIcon('archive') : new vscode.ThemeIcon('repo');
    this.command = {
      title: 'Set Active Project',
      command: 'claudesync.selectProject',
      arguments: [org, project],
    };
  }
}


'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Users, FolderOpen, Globe, Trash2, KeyRound,
    Loader2, RefreshCw, Search, Shield, Star
} from 'lucide-react';

interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    tier: string;
    createdAt: string;
    _count: { projects: number };
}

interface Project {
    id: string;
    name: string;
    customDomain: string | null;
    subdomain: string | null;
    createdAt: string;
    updatedAt: string;
    user: { id: string; name: string | null; email: string };
    _count: { versions: number };
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, projectsRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/projects')
            ]);

            const usersData = await usersRes.json();
            const projectsData = await projectsRes.json();

            setUsers(usersData.users || []);
            setProjects(projectsData.projects || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetPassword = async (userId: string, email: string) => {
        if (!confirm(`Reset password for ${email}?`)) return;

        setActionLoading(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data = await res.json();

            if (data.success) {
                alert(`Password reset!\n\nNew password: ${data.temporaryPassword}\n\nShare this with the user.`);
            } else {
                alert('Failed to reset password');
            }
        } catch (error) {
            alert('Error resetting password');
        }
        setActionLoading(null);
    };

    const updateRole = async (userId: string, newRole: string) => {
        setActionLoading(userId);
        try {
            await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole })
            });
            fetchData();
        } catch (error) {
            alert('Failed to update role');
        }
        setActionLoading(null);
    };

    const deleteProject = async (projectId: string, projectName: string) => {
        if (!confirm(`DELETE project "${projectName}"?\n\nThis cannot be undone!`)) return;

        setActionLoading(projectId);
        try {
            await fetch('/api/admin/projects', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId })
            });
            fetchData();
        } catch (error) {
            alert('Failed to delete project');
        }
        setActionLoading(null);
    };

    const removeDomain = async (projectId: string) => {
        if (!confirm('Remove domain from this project?')) return;

        setActionLoading(projectId);
        try {
            await fetch(`/api/projects/${projectId}/domain`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            alert('Failed to remove domain');
        }
        setActionLoading(null);
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.customDomain?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        p.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projects.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Domains</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {projects.filter(p => p.customDomain).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">PRO Users</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.tier === 'PRO').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search & Refresh */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users, projects, domains..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" onClick={fetchData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="users" className="w-full">
                <TabsList>
                    <TabsTrigger value="users">👥 Users ({filteredUsers.length})</TabsTrigger>
                    <TabsTrigger value="projects">📁 Projects ({filteredProjects.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="mt-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name || 'No name'}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => updateRole(user.id, e.target.value)}
                                                    className="text-sm border rounded px-2 py-1"
                                                    disabled={actionLoading === user.id}
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${user.tier === 'PRO' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.tier}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {user._count.projects}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => resetPassword(user.id, user.email)}
                                                    disabled={actionLoading === user.id}
                                                >
                                                    {actionLoading === user.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <KeyRound className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="projects" className="mt-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domain</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Versions</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{project.name}</div>
                                                <div className="text-xs text-gray-400 font-mono">{project.id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {project.user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {project.customDomain ? (
                                                    <a
                                                        href={`https://${project.customDomain}`}
                                                        target="_blank"
                                                        className="text-blue-600 hover:underline text-sm"
                                                    >
                                                        {project.customDomain}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No domain</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {project._count.versions}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(project.updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {project.customDomain && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeDomain(project.id)}
                                                        disabled={actionLoading === project.id}
                                                        title="Remove domain"
                                                    >
                                                        <Globe className="h-4 w-4 text-orange-500" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteProject(project.id, project.name)}
                                                    disabled={actionLoading === project.id}
                                                    title="Delete project"
                                                >
                                                    {actionLoading === project.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    )}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

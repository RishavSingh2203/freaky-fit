import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TRAINER' | 'USER';
  specialization?: string;
  hourlyRate?: number;
  bio?: string;
}
export default function UserManagement() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateRoleOpen, setIsUpdateRoleOpen] = useState(false);
  const [isUpdateTrainerOpen, setIsUpdateTrainerOpen] = useState(false);
  const [newRole, setNewRole] = useState<'ADMIN' | 'TRAINER' | 'USER'>('USER');
  const [trainerInfo, setTrainerInfo] = useState({
    specialization: '',
    hourlyRate: 0,
    bio: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${selectedUser._id}/role`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role: newRole })
        }
      );

      if (!response.ok) throw new Error('Failed to update role');
      
      toast.success('Role updated successfully');
      setIsUpdateRoleOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleUpdateTrainerInfo = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/trainers/${selectedUser._id}/info`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(trainerInfo)
        }
      );

      if (!response.ok) throw new Error('Failed to update trainer info');
      
      toast.success('Trainer information updated successfully');
      setIsUpdateTrainerOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update trainer information');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog open={isUpdateRoleOpen} onOpenChange={setIsUpdateRoleOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setNewRole(user.role);
                        }}
                      >
                        Update Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update User Role</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Select value={newRole} onValueChange={(value: 'ADMIN' | 'TRAINER' | 'USER') => setNewRole(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="TRAINER">Trainer</SelectItem>
                            <SelectItem value="USER">User</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleUpdateRole}>Update Role</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {user.role === 'TRAINER' && (
                    <Dialog open={isUpdateTrainerOpen} onOpenChange={setIsUpdateTrainerOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setTrainerInfo({
                              specialization: user.specialization || '',
                              hourlyRate: user.hourlyRate || 0,
                              bio: user.bio || ''
                            });
                          }}
                        >
                          Update Info
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Trainer Information</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Specialization"
                            value={trainerInfo.specialization}
                            onChange={(e) => setTrainerInfo({ ...trainerInfo, specialization: e.target.value })}
                          />
                          <Input
                            type="number"
                            placeholder="Hourly Rate (₹)"
                            value={trainerInfo.hourlyRate}
                            onChange={(e) => setTrainerInfo({ ...trainerInfo, hourlyRate: Number(e.target.value) })}
                          />
                          <Textarea
                            placeholder="Bio"
                            value={trainerInfo.bio}
                            onChange={(e) => setTrainerInfo({ ...trainerInfo, bio: e.target.value })}
                          />
                          <Button onClick={handleUpdateTrainerInfo}>Update Information</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 
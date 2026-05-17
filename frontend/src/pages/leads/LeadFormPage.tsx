import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  notes: z.string().optional(),
  assignedTo: z.string().min(1, 'Please assign a user'),
});

type LeadFormValues = z.infer<typeof leadSchema>;

const LeadFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'New',
      source: 'Website',
      notes: '',
      assignedTo: user?._id || ''
    }
  });

  useEffect(() => {
    // We need to fetch users if admin to assign. For simplicity, mock user list or if API is provided we can use it.
    // In this app, we don't have a users endpoint listed. But we can hardcode for demo or ideally call an API.
    // To handle this, we will use the current user if they are Sales User, or allow Admin to manually type an ID if no API.
    // Wait, let's create a small users endpoint or just use the current user for now if we can't fetch them.
    // Assuming we don't have GET /api/users, we'll just set it to the current user ID for sales users.
    if (user?.role !== 'Admin') {
       setValue('assignedTo', user?._id || '');
    }
  }, [user, setValue]);

  useEffect(() => {
    if (isEdit) {
      const fetchLead = async () => {
        try {
          const { data } = await api.get(`/leads/${id}`);
          reset({
            name: data.name,
            email: data.email,
            status: data.status,
            source: data.source,
            notes: data.notes,
            assignedTo: data.assignedTo?._id || data.assignedTo,
          });
        } catch (error) {
          toast.error('Failed to load lead');
          navigate('/leads');
        } finally {
          setFetching(false);
        }
      };
      fetchLead();
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data: LeadFormValues) => {
    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/leads/${id}`, data);
        toast.success('Lead updated successfully');
      } else {
        await api.post('/leads', data);
        toast.success('Lead created successfully');
      }
      navigate('/leads');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Lead' : 'Create New Lead'}</h1>
        <p className="text-gray-500">Fill in the lead details below.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                {...register('name')}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Lead Name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register('email')}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="email@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="input-field">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select {...register('source')} className="input-field">
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
              {errors.source && <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>}
            </div>
            
            {user?.role === 'Admin' && (
               <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To (User ID)</label>
                 <input
                   type="text"
                   {...register('assignedTo')}
                   className={`input-field ${errors.assignedTo ? 'border-red-500' : ''}`}
                   placeholder="Enter User ID"
                 />
                 <p className="text-xs text-gray-500 mt-1">As an Admin, you can paste the User ID to assign this lead to a specific user.</p>
                 {errors.assignedTo && <p className="mt-1 text-sm text-red-600">{errors.assignedTo.message}</p>}
               </div>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                {...register('notes')}
                rows={4}
                className="input-field"
                placeholder="Add any relevant notes here..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/leads')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary min-w-[120px]"
            >
              {loading ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormPage;

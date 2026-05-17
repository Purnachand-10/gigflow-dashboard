import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Sales User']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Sales User'
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', data);
      login(res.data.token, res.data);
      toast.success('Registration successful');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                {...register('name')}
                className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                {...register('email')}
                className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                {...register('password')}
                className={`input-field ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                {...register('role')}
                className={`input-field ${errors.role ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="Sales User">Sales User</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex justify-center py-2.5"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

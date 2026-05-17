import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Globe, Clock, User, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const { data } = await api.get(`/leads/${id}`);
        setLead(data);
      } catch (error) {
        toast.error('Failed to load lead details');
        navigate('/leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id, navigate]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading lead details...</div>;
  if (!lead) return <div className="p-8 text-center text-red-500">Lead not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Leads
        </button>
        <Link to={`/leads/${id}/edit`} className="btn-primary flex items-center gap-2">
          <Edit className="w-4 h-4" /> Edit Lead
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <div className="mt-2 flex items-center text-gray-500 gap-4">
              <span className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {lead.email}</span>
            </div>
          </div>
          <div>
            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full 
              ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' : 
                lead.status === 'Qualified' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'}`}>
              {lead.status}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2"><Globe className="w-4 h-4" /> Source</h3>
              <p className="mt-1 font-medium text-gray-900">{lead.source}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2"><User className="w-4 h-4" /> Assigned To</h3>
              <p className="mt-1 font-medium text-gray-900">{lead.assignedTo?.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Created</h3>
              <p className="mt-1 text-gray-900">
                {new Date(lead.createdAt).toLocaleDateString()} by {lead.createdBy?.name}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2"><FileText className="w-4 h-4" /> Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg min-h-[150px] border border-gray-100 text-gray-700 whitespace-pre-wrap">
              {lead.notes || 'No notes provided.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;

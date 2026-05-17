import { Request, Response } from 'express';
import Lead from '../models/Lead';
import catchAsync from '../utils/catchAsync';
import { Parser } from 'json2csv';

export const createLead = catchAsync(async (req: Request, res: Response) => {
  const { name, email, status, source, notes, assignedTo } = req.body;

  const lead = new Lead({
    name,
    email,
    status,
    source,
    notes,
    assignedTo,
    createdBy: req.user?._id,
  });

  const createdLead = await lead.save();
  res.status(201).json(createdLead);
});

export const getLeads = catchAsync(async (req: Request, res: Response) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const query: any = {};

  if (req.query.status) query.status = req.query.status;
  if (req.query.source) query.source = req.query.source;
  
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  if (req.user?.role !== 'Admin') {
    query.assignedTo = req.user?._id;
  }

  const sortOrder = req.query.sort === 'oldest' ? 1 : -1;

  const count = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .sort({ createdAt: sortOrder })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  res.json({
    leads,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

export const getLeadById = catchAsync(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  if (req.user?.role !== 'Admin' && (lead.assignedTo as any)._id.toString() !== req.user?._id?.toString()) {
     res.status(403);
     throw new Error('Not authorized to view this lead');
  }

  res.json(lead);
});

export const updateLead = catchAsync(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  if (req.user?.role !== 'Admin' && lead.assignedTo.toString() !== req.user?._id?.toString()) {
     res.status(403);
     throw new Error('Not authorized to update this lead');
  }

  const { name, email, status, source, notes, assignedTo } = req.body;

  lead.name = name || lead.name;
  lead.email = email || lead.email;
  lead.status = status || lead.status;
  lead.source = source || lead.source;
  lead.notes = notes !== undefined ? notes : lead.notes;
  
  if (req.user?.role === 'Admin' && assignedTo) {
      lead.assignedTo = assignedTo;
  }

  const updatedLead = await lead.save();
  res.json(updatedLead);
});

export const deleteLead = catchAsync(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  await lead.deleteOne();
  res.json({ message: 'Lead removed' });
});

export const exportLeads = catchAsync(async (req: Request, res: Response) => {
  if (req.user?.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to export');
  }

  const query: any = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.source) query.source = req.query.source;

  const leads = await Lead.find(query)
     .populate('assignedTo', 'name email')
     .populate('createdBy', 'name email');
  
  const fields = ['name', 'email', 'status', 'source', 'notes', 'assignedTo.name', 'createdBy.name', 'createdAt'];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(leads);

  res.header('Content-Type', 'text/csv');
  res.attachment('leads.csv');
  return res.send(csv);
});

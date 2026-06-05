const mongoose = require('mongoose');

/* ------------------------------------------------------------------ */
/*  In-memory data store (used only when MongoDB is unavailable)      */
/* ------------------------------------------------------------------ */
const store = { users: [], tasks: [] };
let _mockActive = false;

const genId = () =>
  Math.random().toString(36).slice(2, 10) +
  Math.random().toString(36).slice(2, 10);

/** Check whether the mock is active */
function isMockActive() { return _mockActive; }

/* ------------------------------------------------------------------ */
/*  connectDB                                                         */
/* ------------------------------------------------------------------ */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.log('⚡ Starting with In-Memory Mock Database');
    _mockActive = true;
  }
};

/* ------------------------------------------------------------------ */
/*  Mock model factories – return plain objects that look like         */
/*  Mongoose models but read/write from the in-memory store.          */
/* ------------------------------------------------------------------ */
function getMockUserModel() {
  const bcrypt = require('bcryptjs');

  function wrap(raw) {
    if (!raw) return null;
    const obj = { ...raw };
    obj.matchPassword = async (entered) => bcrypt.compare(entered, raw.password);
    obj.save = async function () {
      const idx = store.users.findIndex((u) => u._id === raw._id);
      if (idx !== -1) {
        if (this.password && this.password !== raw.password) {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
        }
        Object.assign(store.users[idx], this, { updatedAt: new Date().toISOString() });
        return wrap(store.users[idx]);
      }
      return this;
    };
    return obj;
  }

  return {
    findOne(query) {
      const u = store.users.find((u) => {
        if (query.email) return u.email === query.email;
        if (query._id) return u._id === String(query._id);
        return false;
      });
      return { select() { return this; }, then(r) { r(wrap(u)); }, catch() { return this; } };
    },
    findById(id) {
      const u = store.users.find((u) => u._id === String(id));
      return { select() { return this; }, then(r) { r(wrap(u)); }, catch() { return this; } };
    },
    async create(data) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(data.password, salt);
      const user = {
        _id: genId(), name: data.name, email: data.email,
        password: hashed, avatar: data.avatar || '',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      store.users.push(user);
      return wrap(user);
    },
  };
}

function getMockTaskModel() {
  function wrap(raw) {
    if (!raw) return null;
    const obj = { ...raw };
    obj.save = async function () {
      const idx = store.tasks.findIndex((t) => t._id === raw._id);
      if (idx !== -1) {
        Object.assign(store.tasks[idx], this, { updatedAt: new Date().toISOString() });
        return wrap(store.tasks[idx]);
      }
      return this;
    };
    return obj;
  }

  return {
    find(query) {
      let list = store.tasks.filter((t) => String(t.user) === String(query.user));
      if (query.category) list = list.filter((t) => t.category === query.category);
      if (query.priority) list = list.filter((t) => t.priority === query.priority);
      if (query.status)   list = list.filter((t) => t.status === query.status);
      if (query.title && query.title.$regex) {
        const re = new RegExp(query.title.$regex, query.title.$options || 'i');
        list = list.filter((t) => re.test(t.title));
      }
      return { sort() { return this; }, then(r) { r(list.map(wrap)); }, catch() { return this; } };
    },
    findOne(query) {
      const t = store.tasks.find(
        (t) => String(t._id) === String(query._id) && String(t.user) === String(query.user)
      );
      return { then(r) { r(wrap(t)); }, catch() { return this; } };
    },
    findOneAndDelete(query) {
      const idx = store.tasks.findIndex(
        (t) => String(t._id) === String(query._id) && String(t.user) === String(query.user)
      );
      const removed = idx !== -1 ? store.tasks.splice(idx, 1)[0] : null;
      return { then(r) { r(wrap(removed)); }, catch() { return this; } };
    },
    async create(data) {
      const task = {
        _id: genId(), user: String(data.user), title: data.title,
        description: data.description || '', category: data.category || 'other',
        priority: data.priority || 'medium', status: data.status || 'pending',
        dueDate: data.dueDate || null, completed: data.completed || false,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      store.tasks.push(task);
      return wrap(task);
    },
    async aggregate(pipeline) {
      const matchStage = pipeline.find((s) => s.$match);
      const groupStage = pipeline.find((s) => s.$group);
      if (!matchStage || !groupStage) return [];
      const userId = String(matchStage.$match.user);
      const userTasks = store.tasks.filter((t) => String(t.user) === userId);
      const field = groupStage.$group._id.replace('$', '');
      const counts = {};
      userTasks.forEach((t) => { const v = t[field] || 'unknown'; counts[v] = (counts[v] || 0) + 1; });
      return Object.entries(counts).map(([_id, count]) => ({ _id, count }));
    },
  };
}

module.exports = connectDB;
module.exports.isMockActive = isMockActive;
module.exports.getMockUserModel = getMockUserModel;
module.exports.getMockTaskModel = getMockTaskModel;

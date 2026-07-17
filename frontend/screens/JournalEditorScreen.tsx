import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../lib/theme';
import { useJournal } from '../context/JournalContext';
import { Icon, IconName } from '../components/Icon';

interface Props {
  mode: 'new' | 'edit';
  date: string;
  onClose: () => void;
  onSaved: (date: string) => void;
}

const MOODS: { name: string; emoji: string }[] = [
  { name: 'SAD', emoji: '😢' },
  { name: 'MEH', emoji: '😐' },
  { name: 'OKAY', emoji: '😊' },
  { name: 'GOOD', emoji: '🙂' },
  { name: 'GREAT', emoji: '😀' },
];

const INITIAL_TAGS = ['Grateful', 'Anxious', 'Hopeful', 'Productive', 'Tired'];
const PROMPT =
  'What is one small thing that brought you peace today, no matter how brief?';
const TOOLBAR: IconName[] = ['bold', 'italic', 'list', 'link', 'quote'];

export const JournalEditorScreen: React.FC<Props> = ({
  mode,
  date,
  onClose,
  onSaved,
}) => {
  const { addEntry, updateEntry, getEntryForDate } = useJournal();
  const existing = mode === 'edit' ? getEntryForDate(date) : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [mood, setMood] = useState(existing?.mood ?? 'OKAY');
  const [tags, setTags] = useState<string[]>(existing?.tags ?? ['Grateful']);
  const [addingTag, setAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');

  const dateLabel = useMemo(() => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [date]);

  const toggleTag = (tag: string) =>
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const addNewTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setNewTag('');
    setAddingTag(false);
  };

  const handleSave = () => {
    if (!title.trim()) return setError('Please enter an entry title.');
    if (!content.trim()) return setError('Please write down your thoughts.');
    if (mode === 'edit' && existing) {
      updateEntry({ ...existing, title: title.trim(), content: content.trim(), mood, tags });
    } else {
      addEntry({ date, title: title.trim(), content: content.trim(), mood, tags, prompt: PROMPT });
    }
    onSaved(date);
  };

  const customTags = tags.filter((t) => !INITIAL_TAGS.includes(t));

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.circleBtn}>
            <Icon name="close" size={18} color={colors.slate500} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {mode === 'edit' ? 'Edit Entry' : 'New Entry'}
          </Text>
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>{dateLabel}</Text>
            <View style={styles.dateIcon}>
              <Icon name="calendar" size={11} />
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Mood */}
          <View style={{ gap: 10 }}>
            <Text style={styles.sectionLabel}>HOW ARE YOU FEELING?</Text>
            <View style={styles.moodRow}>
              {MOODS.map((m) => {
                const active = mood === m.name;
                return (
                  <Pressable
                    key={m.name}
                    onPress={() => setMood(m.name)}
                    style={[styles.moodBtn, active && styles.moodActive]}
                  >
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    <Text style={[styles.moodLabel, active && styles.moodLabelActive]}>
                      {m.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Prompt */}
          <View style={styles.promptCard}>
            <Icon name="sparkles" size={18} />
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={styles.promptLabel}>TODAY'S PROMPT</Text>
              <Text style={styles.promptText}>"{PROMPT}"</Text>
            </View>
          </View>

          {/* Title */}
          <View style={{ gap: 6 }}>
            <Text style={styles.sectionLabel}>TITLE</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Good Morning Entry, Quiet Evening"
              placeholderTextColor={colors.slate400}
              style={styles.input}
            />
          </View>

          {/* Thoughts */}
          <View style={{ gap: 10 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionLabel}>YOUR THOUGHTS</Text>
              {mode === 'new' && (
                <View style={styles.autosave}>
                  <Text style={styles.autosaveText}>Auto-saving</Text>
                  <View style={styles.autosaveDot} />
                </View>
              )}
            </View>
            <View style={styles.editorBox}>
              <View style={styles.toolbar}>
                {TOOLBAR.map((ic) => (
                  <Text key={ic} style={styles.toolIcon}>
                    <Icon name={ic} size={15} color={colors.slate500} />
                  </Text>
                ))}
                <View style={{ flex: 1 }} />
                <Pressable onPress={() => setContent((c) => c.slice(0, -10))}>
                  <Icon name="undo" size={15} color={colors.slate500} />
                </Pressable>
              </View>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Start writing here..."
                placeholderTextColor={colors.slate400}
                multiline
                textAlignVertical="top"
                style={styles.textarea}
              />
            </View>
          </View>

          {/* Tags */}
          <View style={{ gap: 10 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionLabel}>TAGS</Text>
              {!addingTag ? (
                <Pressable onPress={() => setAddingTag(true)} style={styles.addNew}>
                  <Icon name="plus" size={14} color={colors.brand} />
                  <Text style={styles.addNewText}>Add New</Text>
                </Pressable>
              ) : (
                <View style={styles.addRow}>
                  <TextInput
                    value={newTag}
                    onChangeText={setNewTag}
                    placeholder="New tag..."
                    placeholderTextColor={colors.slate400}
                    onSubmitEditing={addNewTag}
                    autoFocus
                    style={styles.tagInput}
                  />
                  <Pressable onPress={addNewTag}>
                    <Text style={styles.addConfirm}>ADD</Text>
                  </Pressable>
                </View>
              )}
            </View>

            <View style={styles.tagWrap}>
              {INITIAL_TAGS.map((tag) => {
                const sel = tags.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    onPress={() => toggleTag(tag)}
                    style={[styles.tag, sel ? styles.tagSel : styles.tagIdle]}
                  >
                    <Text style={[styles.tagText, sel && styles.tagTextSel]}>{tag}</Text>
                  </Pressable>
                );
              })}
              {customTags.map((tag) => (
                <Pressable key={tag} onPress={() => toggleTag(tag)} style={[styles.tag, styles.tagSel]}>
                  <Text style={[styles.tagText, styles.tagTextSel]}>{tag}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Save */}
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}
          >
            <Icon name="save" size={18} color={colors.white} />
            <Text style={styles.saveText}>
              {mode === 'edit' ? 'Save Changes' : 'Save Entry'}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: {
    width: '100%',
    maxWidth: 420,
    flex: 1,
    maxHeight: 820,
    backgroundColor: colors.white,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.slate100,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.slate50,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: colors.dark },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  datePillText: { fontSize: 12, fontWeight: '700', color: colors.slate500 },
  dateIcon: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: 24, paddingVertical: 20, gap: 24 },
  errorBox: { backgroundColor: colors.redBg, borderRadius: 14, padding: 12 },
  errorText: { color: colors.red, fontSize: 13, fontWeight: '600' },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: colors.slate400, letterSpacing: 1 },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.slate50,
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.slate100,
    gap: 4,
  },
  moodBtn: { flex: 1, alignItems: 'center', gap: 5, paddingVertical: 10, borderRadius: 12 },
  moodActive: { backgroundColor: colors.brand },
  moodEmoji: { fontSize: 20 },
  moodLabel: { fontSize: 9, fontWeight: '800', color: colors.slate400, letterSpacing: 0.5 },
  moodLabelActive: { color: colors.white },
  promptCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.brandLight,
    borderWidth: 1,
    borderColor: colors.brandTint,
    borderRadius: 18,
    padding: 16,
  },
  promptLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, color: colors.brand },
  promptText: { fontSize: 12, fontWeight: '700', color: colors.slate700, fontStyle: 'italic', lineHeight: 19 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: colors.slate800,
    backgroundColor: colors.white,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  autosave: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  autosaveText: { fontSize: 10, fontWeight: '700', color: colors.slate400 },
  autosaveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green },
  editorBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: colors.slate50,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  toolIcon: { fontWeight: '800' },
  textarea: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.slate800,
    minHeight: 160,
    lineHeight: 22,
  },
  addNew: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addNewText: { fontSize: 12, fontWeight: '800', color: colors.brand },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tagInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 12,
    minWidth: 90,
    color: colors.slate800,
  },
  addConfirm: { fontSize: 10, fontWeight: '800', color: colors.brand, letterSpacing: 0.5 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  tagSel: { backgroundColor: colors.brand, borderColor: colors.brand },
  tagIdle: { backgroundColor: colors.slate50, borderColor: colors.slate100 },
  tagText: { fontSize: 12, fontWeight: '700', color: colors.slate500 },
  tagTextSel: { color: colors.white },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.brand,
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 8,
  },
  saveText: { color: colors.white, fontWeight: '800', fontSize: 16 },
  pressed: { backgroundColor: colors.brandHover },
});

export default JournalEditorScreen;

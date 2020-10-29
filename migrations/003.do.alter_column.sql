ALTER TABLE notes
  ADD COLUMN
    folder_id INTEGER REFERENCES folders(id)
    ON DELETE CASCADE NOT NULL;-- removed SET NULL should add back
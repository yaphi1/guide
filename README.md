# guide


New note
	click button
	create new note title dom element
	associate it with the main text area
	highlight note title
	focus on the text area
	onkeyup, make title equal to the first non-space character followed by any number of non-newline characters
	add the note to the updated_notes object

Select note
	highlight note
	associate text area with the correct note data

Edit note
	add the note to the updated_notes object

Save button
	save everything from the updated_notes object and clear the object
	use time created (not updated) as key for object in order to keep consistency

Delete note
	straightforward - delete currently selected note after confirmation

Search
	on key up, find all notes that match every word in the search query (in any order and ignoring case)

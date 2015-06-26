package main

import (
	"archive/zip"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
)

func main() {
	argc := len(os.Args)
	log.Println(os.Args)
	if argc < 2 {
		return
	}

	files := []string{}
	for _, f := range os.Args[1:] {
		// Check if the file or directory exists
		fi, err := os.Stat(f)
		if os.IsNotExist(err) {
			continue
		}

		// Check if this is a directory
		if fi.IsDir() {
			for file := range getFiles(f) {
				files = append(files, file)
			}
		} else {
			files = append(files, f)
		}
	}

	// Create a new buffer and archive file
	archiveFile := "bundle.zip"
	zipFile, err := os.Create(archiveFile)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("Created", archiveFile)

	// Open a new writer to the compressed archive
	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	// Go through each listed file adding them to the compressed archive
	for _, file := range files {
		f, err := zipWriter.Create(file)
		if err != nil {
			continue
		}

		if b, err := ioutil.ReadFile(file); err == nil {
			if _, err := f.Write(b); err != nil {
				continue
			}

			log.Println("Compressed", file)
		}
	}
}

// getFiles recursively goes through directories returning file names.
func getFiles(path string) chan string {
	c := make(chan string)

	go func() {
		filepath.Walk(path, func(p string, fi os.FileInfo, e error) error {
			if e != nil {
				return e
			}

			if fi.IsDir() {
				return nil
			}

			c <- p
			return nil
		})

		close(c)
	}()

	return c
}

// Package search indexes and queries warehouse items in Elasticsearch.
package search

import (
	"strings"

	"github.com/elastic/go-elasticsearch/v8"
)

// Index wraps the go-elasticsearch client.
type Index struct {
	es *elasticsearch.Client
}

// NewIndex builds a search index helper.
func NewIndex() (*Index, error) {
	es, err := elasticsearch.NewDefaultClient()
	if err != nil {
		return nil, err
	}
	return &Index{es: es}, nil
}

// IndexItem indexes an item document.
func (i *Index) IndexItem(doc string) error {
	_, err := i.es.Index("items", strings.NewReader(doc))
	return err
}

// SearchItems runs a full-text query over the items index.
func (i *Index) SearchItems(body string) error {
	_, err := i.es.Search(
		i.es.Search.WithIndex("items"),
		i.es.Search.WithBody(strings.NewReader(body)),
	)
	return err
}

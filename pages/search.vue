<script>
  import axios from 'axios';
  import _ from 'lodash';

  export default {
    name: 'Search',
    components: {
      pagination: require('vue-bootstrap-pagination')
    },
    head: {
      title: 'Search Spotify'
    },
    data: () => {
      return {
        loading: false,
        empty: false,
        query: '',
        artists: [],
        limit: 5,
        page: 1,
        total: -1,
      };
    },
    methods: {
      onSubmit: function (e) {
        this.fetchData();
      },
      fetchData: function () {
        if (this.query.length > 3) {
          this.loading = true;
          axios.get('/api/search', {
            params: {
              query: this.query,
              limit: this.limit,
              offset: this.page - 1
            }
          })
          .then((response) => {
            console.log('Search:', response.data);
            this.artists = response.data.artists.items;
            this.limit = response.data.artists.limit;
            this.page = response.data.artists.offset + 1;
            this.total = response.data.artists.total;
            this.empty = this.total === 0;
            this.loading = false;
          })
          .catch((error) => {
            console.error(error);
            this.loading = false;
          });
        }
      },
      getArtistThumbnail: function (artist) {
        if (!_.has(artist, 'images')) {
          return 'http://placehold.it/64x64';
        }
        return _.get(_.last(artist.images), 'url', 'http://placehold.it/64x64');
      },
      getArtistGenres: function (artist) {
        return _.join(artist.genres, ', ');
      }
    },
    computed: {
      pagination: function () {
        return {
          total: this.total,
          per_page: this.limit,
          current_page: this.page,
          last_page: Math.ceil(this.total / this.limit)
        };
      },
      paginationOptions: function () {
        return {
          offset: 2,
          alwaysShowPrevNext: false
        };
      }
    }
  }
</script>

<template>
  <div>
    <div class="container">
      <div class="page-header">
        <h1>Artistes</h1>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">Rechercher un artiste Spotify</div>
        <div class="panel-body">
          <form @submit.prevent="onSubmit" class="form-inline">
            <div class="form-group">
              <input type="search" v-model="query" class="form-control" placeholder="Mot(s)-clé(s)" />
            </div>
            <button type="submit" class="btn btn-primary">Chercher</button>
          </form>
        </div>
      </div>
    </div>

    <div v-if="loading" class="container">
      <div class="alert alert-info">
        Recherche en cours...
      </div>
    </div>

    <div v-if="!loading && total > 0" class="container artists">
      <div v-for="artist in artists" class="media">
        <div class="media-left">
          <router-link v-bind:to="'/artist/' + artist.id">
            <img class="media-object" v-bind:src="getArtistThumbnail(artist)" width="64" alt="*" />
          </router-link>
        </div>
        <div class="media-body">
          <h4 class="media-heading">
            <router-link v-bind:to="'/artist/' + artist.id">
              {{ artist.name }}
            </router-link>
          </h4>
          {{ getArtistGenres(artist) }}<br />
          <a v-bind:href="artist.external_urls.spotify">{{ artist.external_urls.spotify }}</a>
        </div>
      </div>
      <div v-show="total > limit" class="text-center">
        <pagination :pagination="pagination" :callback="fetchData" :options="paginationOptions"></pagination>
      </div>
    </div>
    <div v-else-if="empty" class="container">
      <div class="alert alert-warning">
        Aucun résultats correspondant à votre recherche <mark>{{ query }}</mark>.
      </div>
    </div>
  </div>
</template>

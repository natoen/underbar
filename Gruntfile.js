module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    eslint: {
      target: [
        'src/underbar.js',
      ],
      options: {
        force: 'true',
        eslintrc: '.eslintrc.js',
        ignores: [],
      },
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['lib/chai.js', 'lib/mocha.js', 'lib/sinon.js', 'lib/sinon-chai.js',
              'lib/cardboard.js', 'lib/testSupport.js'],
        dest: 'lib/lib.concat.js',
      },
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      },
      dist: {
        files: {
          'lib/lib.min.js': ['<%= concat.dist.dest %>'],
        },
      },
    },

    cssmin: {
      options: {
        keepSpecialComments: 0,
      },
      target: {
        files: [{
          expand: true,
          cwd: 'lib/css',
          src: ['mocha.css'],
          dest: 'lib/css',
          ext: '.min.css',
        }],
      },
    },

    shell: {
      removeFiles: {
        command: 'rm lib/lib.concat.js',
        options: {
          stdout: true,
          stderr: true,
          failOnError: true,
        },
      },
    },

    watch: {
      scripts: {
        files: [
          'src/underbar.js',
        ],
        tasks: [
          'eslint',
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['concat', 'uglify', 'cssmin', 'shell:removeFiles']);
};

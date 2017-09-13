import { OnInit } from '@angular/core';

import { Component } from '@angular/core';

import { PostService } from './services/post.service';

import { AppError } from './common/app-error';
import { NotFoundError } from './common/not-found-error';

@Component({
    selector: 'posts-component',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit { 
    posts: any[];

    constructor(private service: PostService) { }

    ngOnInit() {
        this.service.getPosts()
                    .subscribe(response => {
                        this.posts = response.json();
                     }, error => { 
                       alert('an unexpected error occurred.');
                       console.log(error);
                    });
    }

    createPost(input: HTMLInputElement) {
        let post = { title: input.value };
        input.value='';
        this.service.createPost(input)
                    .subscribe(
                       response => {
                          post['id'] = response.json().id;
                          this.posts.splice(0, 0, post);
                          console.log(response.json());
                       }, 
                       (error: Response) => {
                          if(error instanceof NotFoundError) {
                            alert('This post has not been created.');
                          }
                          else {
                            alert('an unexpected error occurred.');
                            console.log(error);
                          }   
                    });
    }

    updatePost(post) {
        this.service.updatePost(post)
                 .subscribe(
                    response => {
                       console.log(response.json());
                    }, 
                    error => {
                       alert('an unexpected error occurred.');
                       console.log(error);
                 });
    }

    deletePost(post) {
        this.service.deletePost(345)
                 .subscribe(
                    response => {
                       let index = this.posts.indexOf(post);
                       this.posts.splice(index, 1);
                    }, 
                    (error: AppError) => {
                       if(error instanceof NotFoundError)
                          alert('This post has already been deleted.');
                       else {
                          alert('An unexpected error occurred.');
                          console.log(error);
                       }

                 });
    }
}
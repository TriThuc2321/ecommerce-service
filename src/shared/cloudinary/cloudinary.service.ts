import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
  UploadResponseCallback,
  v2 as cloudinary,
} from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Injectable()
export class CloudinaryService {
  uploadFile(
    url: string,
    option?: UploadApiOptions,
    callback?: UploadResponseCallback,
  ): Promise<CloudinaryResponse> {
    return cloudinary.uploader.upload(url, option, callback);
  }
}

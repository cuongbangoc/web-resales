import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CustomerItem } from 'src/app/shared/models/user.model';
import { CatalogService } from 'src/app/home/services/catalog.service';
import { ProductItem } from 'src/app/home/models/products.model';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit, OnDestroy {

  user: CustomerItem;
  products: ProductItem[] = [];
  userId: string;
  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private catalogService: CatalogService,
    private router: Router,
    private dialogMessageService: DialogMessageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(params => {
      this.userId = params.id;
      this.httpClient.post(`http://localhost:6789/api/users/getUserById/${params.id}`, null).subscribe((user: CustomerItem) => {
        this.user = user;
      });
      this.catalogService.getProductByAccountId(params.id).subscribe(products => {
        this.products = products.items;
      });
    });


  }




  ngOnDestroy(): void { }

  viewDetail(productId, wardID) {
    this.router.navigate(['/products/detail'], { queryParams: { productId, wardID }, relativeTo: this.activatedRoute },);
  }

  deleteProduct(id) {
    this.dialogMessageService.showConfirmButton('Thông báo!', 'Bạn muốn xóa sản phẩm này').then((result) => {
      if (result.value) {
        this.catalogService.deleteProduct(id).subscribe(res => {
          Swal.fire(
            'Đã xóa!',
            'Bạn đã xóa thành công.',
            'success'
          );
          window.location.reload();
        });
      }
    })
  }

  updateUser() {
    this.router.navigate(['/updateUser'], { queryParams: { idUser: this.userId } });
  }

}

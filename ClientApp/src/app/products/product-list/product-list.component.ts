import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from '../../interface/product';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  // for the FormControl - AddingProducts
  insertForm: FormGroup;
  name: FormControl;
  price: FormControl;
  description: FormControl;
  imageUrl: FormControl;

  //for updating the products
  updateForm: FormGroup;
  _name: FormControl;
  _price: FormControl;
  _description: FormControl;
  _imageUrl: FormControl
  _id: FormControl;

  //Add product Modal
  @ViewChild('template', {static: true}) modal: TemplateRef<any>

  //Add product Update Modal
  @ViewChild('editTemplate', { static: true }) editModal: TemplateRef<any>

  //modal properties
  modalMessage: string;
  modalRef: BsModalRef;
  selectedProduct: Product;
  product$: Observable<Product[]>;
  products: Product[] = [];
  userRoleStatus: string;

  //datatables property
  dtOptions: DataTables.Settings = {}; //used to initialise the dataTable
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective, { static: true }) dtElement: DataTableDirective;

  constructor(private productService: ProductService,
    private modalService: BsModalService,
    private fb: FormBuilder) { }

  onAddProduct()
  {
    this.modalRef = this.modalService.show(this.modal);
  }

  onSubmit() {
    let newProduct = this.insertForm.value;
    this.productService.insertProduct(newProduct).subscribe(result => {
      this.productService.clearCache();
      this.product$ = this.productService.getProducts();

      this.product$.subscribe(newlist => {
        this.products = newlist;
        this.modalRef.hide();
        this.insertForm.reset();
        this.dtTrigger.next();
      });
      console.log('new products have been added');
    },
      error => console.log('could not add product')
      );
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.product$ = this.productService.getProducts();
    this.product$.subscribe(result => {
      this.products = result
      //load products into the datatable
      this.dtTrigger.next();
    });

    // modal message
    this.modalMessage = "All Fields Are Mandatory";

    // initialise add product property
    let validateImageUrl: string = '^(https?:\/\/.*\.)$';

    this.name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
    this.description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
    this.imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);

    this.insertForm = this.fb.group({

      'name': this.name,
      'price': this.price,
      'description': this.description,
      'imageUrl': this.imageUrl,
      'outOfStock': true,

    });
  }

}

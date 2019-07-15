import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from '../../interface/product';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy
{

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
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router) { }

  onAddProduct()
  {
    this.modalRef = this.modalService.show(this.modal);
  }

  onSubmit() {
    let newProduct = this.insertForm.value;
    this.productService.insertProduct(newProduct).subscribe(result => {
      this.productService.clearCache();
      this.product$ = this.productService.getProducts();

      this.product$.subscribe(newlist =>
      {
        this.products = newlist;
        this.modalRef.hide();
        this.insertForm.reset();
        this.rerender();

      });
      console.log('new products have been added');
    },
      error => console.log('could not add product')
      );
  }

  onUpdate()
  {
    let editProduct = this.updateForm.value;
    this.productService.updateProduct(editProduct.id, editProduct).subscribe(result => {
      console.log("Product Updated");
      this.productService.clearCache();
      this.product$ = this.productService.getProducts();

      this.product$.subscribe(editList =>
      {
        this.products = editList;
        this.modalRef.hide();
        this.rerender();
      });
    },
      error => console.log('could not update product')
    );
  }

  onUpdateModal(productEdit: Product): void
  {
    this._id.setValue(productEdit.productId);
    this._name.setValue(productEdit.name);
    this._price.setValue(productEdit.price);
    this._description.setValue(productEdit.description);
    this._imageUrl.setValue(productEdit.imageUrl);

    //update the form
    this.updateForm.setValue({

      'id': this._id.value,
      'name': this._name.value,
      'price': this._price.value,
      'description': this._description.value,
      'imageUrl': this._imageUrl.value,
      'outOfStock': true
    });

    //display modal to user
    this.modalRef = this.modalService.show(this.editModal);
  }

  onDelete(product: Product): void
  {
    this.productService.deleteProduct(product.productId).subscribe(result =>
    {
      console.log('product deleted succesfully');
      this.productService.clearCache();
      this.product$ = this.productService.getProducts();
      this.product$.subscribe(remainProduct =>
      {
        this.products = remainProduct;
        this.rerender();

      });
    },
      error => console.log('this product could not be deleted')
    );
  }

  onSelect(product: Product): void
  {
    this.selectedProduct = product;
    this.router.navigateByUrl("/products/" + product.productId);

  }
   // method is used destroy the old datatable and rerender it
  rerender()
  {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) =>
    {
      // destroy the old datatable 
      dtInstance.destroy();
      // call dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  
  ngOnInit()
  {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.product$ = this.productService.getProducts();
    this.product$.subscribe(result => {
      this.products = result

      //detect for changes
      this.chRef.detectChanges();

      //load products into the datatable
      this.dtTrigger.next();
    });

    // modal message
    this.modalMessage = "All Fields Are Mandatory";

    // initialise add product property
    let validateImageUrl: string = '^(https?:\/\/.*\.)$';

    this.name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(90000)]);
    this.description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
    this.imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);

    this.insertForm = this.fb.group({

      'name': this.name,
      'price': this.price,
      'description': this.description,
      'imageUrl': this.imageUrl,
      'outOfStock': true,
    });

    //initializing update product properties
    this._name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(90000)]);
    this._description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
    this._imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);
    this._id = new FormControl();

    this.updateForm = this.fb.group({

      'id': this._id,
      'name': this._name,
      'price': this._price,
      'description': this._description,
      'imageUrl': this._imageUrl,
      'outOfStock': true
    });

  }
  ngOnDestroy() {
    //  always unsubscire your datatables
    this.dtTrigger.unsubscribe();
  }


}

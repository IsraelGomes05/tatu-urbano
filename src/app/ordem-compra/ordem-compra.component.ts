import {Component, OnInit} from '@angular/core';
import {OrdemCompraService} from '../ordem-compra.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Pedido} from '../shared/pedido.model';
import {CarrinhoService} from '../carrinho.service';
import {ItemCarrinho} from '../shared/item-carrinho.model';

@Component({
  selector: 'app-ordem-compra',
  templateUrl: './ordem-compra.component.html',
  styleUrls: ['./ordem-compra.component.css'],
  providers: [OrdemCompraService]
})
export class OrdemCompraComponent implements OnInit {

  public idCompra: number = undefined;
  public itensCarrinho: ItemCarrinho[] = [];

  public formulario: FormGroup = new FormGroup({
    'endereco': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(120)]),
    'numero': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]),
    'complemento': new FormControl(null),
    'formaPagamento': new FormControl(null, [Validators.required])
  });

  constructor(
    private ordemCompraService: OrdemCompraService,
    public carrinhoService: CarrinhoService) {
  }

  ngOnInit() {
    this.itensCarrinho = this.carrinhoService.getItens();
  }

  public confirmarCompra(): void {
    if (this.formulario.status === 'INVALID') {
      this.formulario.get('endereco').markAsTouched();
      this.formulario.get('numero').markAsTouched();
      this.formulario.get('formaPagamento').markAsTouched();
      return;
    }

    if (this.carrinhoService.getItens().length === 0) {
      alert('O carrinho está vazio!');
      return;
    }

    const pedido: Pedido = new Pedido (
      this.formulario.value.endereco,
      this.formulario.value.numero,
      this.formulario.value.complemento,
      this.formulario.value.formaPagamento,
      this.carrinhoService.getItens()
    );

    this.ordemCompraService.efetivarCompra(pedido)
      .subscribe((res: number) => {
          this.idCompra = res;
          this.carrinhoService.limparCarrinho();
        },
        (error) => {
          console.log(error);
        });
  }

  public adicionar(item: ItemCarrinho): void {
    this.carrinhoService.adicionarQuantidade(item);
  }

  public remover(item: ItemCarrinho) {
    this.carrinhoService.subtrairQuantidade(item);
  }
}
